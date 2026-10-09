import os
import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr
from datetime import datetime
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

APP_URL = os.getenv("APP_URL", "http://localhost:5173")
APP_NAME = "KrushiMitra"

# Track sent emails for dev preview
RECENT_SENT_EMAILS = []


def get_smtp_config():
    """Dynamically reads SMTP settings strictly from environment variables."""
    server = os.getenv("SMTP_SERVER", "smtp.gmail.com").strip()
    port = int(os.getenv("SMTP_PORT", "587"))
    email = os.getenv("SMTP_EMAIL", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    return server, port, email, password


def is_smtp_configured():
    """Checks if real email credentials (API key or SMTP) are configured."""
    if os.getenv("RESEND_API_KEY", "").strip():
        return True
    if os.getenv("BREVO_API_KEY", "").strip():
        return True
    if os.getenv("EMAIL_WEBHOOK_URL", "").strip() or os.getenv("GMAIL_WEBHOOK_URL", "").strip():
        return True
    _, _, email, password = get_smtp_config()
    return bool(email and password and email != "your-email@gmail.com")


def send_via_resend(api_key, to_email, subject, html_content, text_content=None):
    """Sends email via Resend HTTP REST API over port 443 (never blocked by cloud firewalls)."""
    import requests
    headers = {
        "Authorization": f"Bearer {api_key.strip()}",
        "Content-Type": "application/json"
    }
    from_addr = os.getenv("RESEND_FROM", "KrushiMitra <onboarding@resend.dev>").strip()
    payload = {
        "from": from_addr,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    if text_content:
        payload["text"] = text_content
    r = requests.post("https://api.resend.com/emails", json=payload, headers=headers, timeout=12)
    if r.status_code in (200, 201):
        return True, r.json()
    return False, f"Resend API error ({r.status_code}): {r.text}"


def send_via_brevo(api_key, to_email, subject, html_content, text_content=None):
    """Sends email via Brevo HTTP REST API over port 443 (never blocked by cloud firewalls)."""
    import requests
    headers = {
        "api-key": api_key.strip(),
        "Content-Type": "application/json",
        "accept": "application/json"
    }
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "krushimitra.project1@gmail.com").strip()
    payload = {
        "sender": {"name": "KrushiMitra कृषीमित्र", "email": sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content
    }
    if text_content:
        payload["textContent"] = text_content
    r = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers, timeout=12)
    if r.status_code in (200, 201):
        return True, r.json()
    return False, f"Brevo API error ({r.status_code}): {r.text}"


def send_via_webhook(webhook_url, to_email, subject, html_content, text_content=None):
    """Sends email via HTTP Webhook / Google Apps Script relay over port 443."""
    import requests
    payload = {
        "to": to_email,
        "subject": subject,
        "html": html_content,
        "text": text_content or ""
    }
    r = requests.post(webhook_url.strip(), json=payload, headers={"Content-Type": "application/json"}, timeout=12)
    if r.status_code in (200, 201):
        return True, r.text
    return False, f"Webhook error ({r.status_code}): {r.text}"


def send_email_robust(to_email, subject, html_content, text_content=None, wait_timeout=5):
    """
    Sends an email using available HTTP APIs (Resend, Brevo, Webhook) or fallback SMTP.
    HTTP APIs use port 443 which bypasses cloud firewall restrictions on Render.
    """
    to_email = (to_email or "").strip()
    result = {
        "success": False,
        "error": None,
        "delivered": False,
        "simulated": False,
        "provider": None
    }

    def worker():
        api_errors = []

        # 1. Try Resend HTTP API (Port 443)
        resend_key = os.getenv("RESEND_API_KEY", "").strip()
        if resend_key:
            try:
                ok, detail = send_via_resend(resend_key, to_email, subject, html_content, text_content)
                if ok:
                    print(f"[EMAIL SERVICE] Email successfully dispatched via Resend API to: {to_email}", flush=True)
                    result["success"] = True
                    result["delivered"] = True
                    result["provider"] = "resend"
                    RECENT_SENT_EMAILS.append({"to": to_email, "subject": subject, "provider": "resend", "timestamp": datetime.now().isoformat(), "simulated": False})
                    return
                api_errors.append(f"Resend: {detail}")
                print(f"[EMAIL SERVICE] Resend returned non-200: {detail}. Falling back...", flush=True)
            except Exception as e:
                api_errors.append(f"Resend exception: {e}")
                print(f"[EMAIL SERVICE] Resend invocation error: {e}. Falling back...", flush=True)

        # 2. Try Brevo HTTP API (Port 443)
        brevo_key = os.getenv("BREVO_API_KEY", "").strip()
        if brevo_key:
            try:
                ok, detail = send_via_brevo(brevo_key, to_email, subject, html_content, text_content)
                if ok:
                    print(f"[EMAIL SERVICE] Email successfully dispatched via Brevo API to: {to_email}", flush=True)
                    result["success"] = True
                    result["delivered"] = True
                    result["provider"] = "brevo"
                    RECENT_SENT_EMAILS.append({"to": to_email, "subject": subject, "provider": "brevo", "timestamp": datetime.now().isoformat(), "simulated": False})
                    return
                api_errors.append(f"Brevo: {detail}")
                print(f"[EMAIL SERVICE] Brevo returned non-200: {detail}. Falling back...", flush=True)
            except Exception as e:
                api_errors.append(f"Brevo exception: {e}")
                print(f"[EMAIL SERVICE] Brevo invocation error: {e}. Falling back...", flush=True)

        # 3. Try Webhook / Google Apps Script Relay (Port 443)
        webhook_url = (os.getenv("EMAIL_WEBHOOK_URL", "") or os.getenv("GMAIL_WEBHOOK_URL", "")).strip()
        if webhook_url:
            try:
                ok, detail = send_via_webhook(webhook_url, to_email, subject, html_content, text_content)
                if ok:
                    print(f"[EMAIL SERVICE] Email successfully dispatched via Webhook to: {to_email}", flush=True)
                    result["success"] = True
                    result["delivered"] = True
                    result["provider"] = "webhook"
                    RECENT_SENT_EMAILS.append({"to": to_email, "subject": subject, "provider": "webhook", "timestamp": datetime.now().isoformat(), "simulated": False})
                    return
                api_errors.append(f"Webhook: {detail}")
                print(f"[EMAIL SERVICE] Webhook error: {detail}. Falling back...", flush=True)
            except Exception as e:
                api_errors.append(f"Webhook exception: {e}")
                print(f"[EMAIL SERVICE] Webhook invocation error: {e}. Falling back...", flush=True)

        # 4. Standard SMTP Dispatch (Works locally or on unblocked hosts)
        try:
            server_host, port, sender_email, sender_password = get_smtp_config()

            if not (sender_email and sender_password):
                # Simulation Mode
                log_entry = {
                    "to": to_email,
                    "subject": subject,
                    "html": html_content,
                    "text": text_content or "",
                    "timestamp": datetime.now().isoformat(),
                    "simulated": True,
                    "provider": "simulation"
                }
                RECENT_SENT_EMAILS.append(log_entry)
                if len(RECENT_SENT_EMAILS) > 50:
                    RECENT_SENT_EMAILS.pop(0)
                print(f"[EMAIL SERVICE (SIMULATION)] Mail logged for: {to_email}", flush=True)
                result["success"] = True
                result["simulated"] = True
                result["delivered"] = True
                result["provider"] = "simulation"
                return

            msg = MIMEMultipart("alternative")
            msg["Subject"] = Header(subject, "utf-8")
            msg["From"] = formataddr((str(Header(APP_NAME, "utf-8")), sender_email))
            msg["To"] = to_email

            if text_content:
                msg.attach(MIMEText(text_content, "plain", "utf-8"))
            msg.attach(MIMEText(html_content, "html", "utf-8"))

            server = smtplib.SMTP(server_host, port, timeout=12)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, [to_email], msg.as_string())
            server.quit()

            log_entry = {
                "to": to_email,
                "subject": subject,
                "timestamp": datetime.now().isoformat(),
                "simulated": False,
                "provider": "smtp"
            }
            RECENT_SENT_EMAILS.append(log_entry)
            print(f"[EMAIL SERVICE] Real SMTP Email successfully sent to: {to_email}", flush=True)
            result["success"] = True
            result["delivered"] = True
            result["provider"] = "smtp"

        except Exception as e:
            err_msg = str(e)
            if "Network is unreachable" in err_msg or "101" in err_msg or "timed out" in err_msg:
                print(
                    f"[EMAIL SERVICE NOTICE] Cloud firewall (Render free tier) blocked outbound SMTP port ({server_host}:{port}). "
                    f"To enable real emails on Render, add BREVO_API_KEY or RESEND_API_KEY to Render Environment Variables.",
                    flush=True
                )
            else:
                print(f"[EMAIL SERVICE ERROR] Failed to send email to {to_email}: {err_msg}", flush=True)

            log_data = {
                "to": to_email,
                "subject": subject,
                "error": err_msg,
                "timestamp": datetime.now().isoformat(),
                "simulated": True,
                "provider": "failed_smtp"
            }
            if api_errors:
                log_data["api_errors"] = api_errors
            RECENT_SENT_EMAILS.append(log_data)
            result["success"] = False
            result["error"] = err_msg

    thread = threading.Thread(target=worker, daemon=True)
    thread.start()

    if wait_timeout and wait_timeout > 0:
        thread.join(timeout=min(wait_timeout, 2.5))
        if thread.is_alive():
            print(f"[EMAIL SERVICE] Email to {to_email} transmitting in background...", flush=True)
            return {"success": True, "delivered": False, "pending": True}

    return result


def _send_email_async(to_email, subject, html_content, text_content=None, wait_timeout=5):
    """Backward-compatible alias for send_email_robust."""
    return send_email_robust(to_email, subject, html_content, text_content, wait_timeout=wait_timeout)



def format_display_name(name, email):
    """
    Returns a clean, human-readable display name.
    If name is not present or generic, extracts a clean capitalized name from the email handle.
    """
    if name and str(name).strip() and str(name).strip().lower() != "farmer":
        return str(name).strip()
    if email and "@" in email:
        raw_prefix = email.split("@")[0]
        clean = raw_prefix.replace(".", " ").replace("_", " ").replace("-", " ")
        parts = [p.capitalize() for p in clean.split() if p and not p.isdigit()]
        if parts:
            return " ".join(parts)
    return "Farmer"


def send_welcome_email(to_email, user_name=None, district="Maharashtra", kisan_id=None, phone=None, wait_timeout=5):
    """Sends an official branded Welcome email to newly registered farmers."""
    display_name = format_display_name(user_name, to_email)
    dist_text = district if district and str(district).strip() else "Maharashtra"
    kid_text = kisan_id if kisan_id and str(kisan_id).strip() else f"MH-KISAN-{int(datetime.now().timestamp()) % 1000000:06d}"
    login_url = f"{APP_URL}/login"

    
    subject = f"🌾 Welcome to KrushiMitra, {display_name}! Your Smart Farming Account is Ready"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F4F9F2; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.08); border: 1px solid #DCE8D9; }}
        .header {{ background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #10B981 100%); padding: 36px 30px; text-align: center; color: #ffffff; }}
        .logo {{ font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }}
        .tagline {{ font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; opacity: 0.95; margin-top: 6px; color: #C8E6C9; }}
        .body {{ padding: 36px 32px; color: #17291A; line-height: 1.6; font-size: 14px; }}
        .welcome-title {{ font-size: 22px; font-weight: 800; color: #1B5E20; margin-top: 0; margin-bottom: 8px; }}
        .kisan-card {{ background: linear-gradient(135deg, #EAF7EC 0%, #F4FAF5 100%); border-radius: 16px; padding: 20px 24px; margin: 24px 0; border: 1.5px solid #C8E6C9; }}
        .kisan-row {{ display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }}
        .kisan-label {{ color: #557258; font-weight: 600; }}
        .kisan-value {{ color: #1B5E20; font-weight: 800; }}
        .badge {{ display: inline-block; background: #1B5E20; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; }}
        .feature-card {{ background: #FAFCFA; border-radius: 14px; padding: 18px 20px; margin: 20px 0; border: 1px solid #E2EAE0; }}
        .feature-item {{ margin-bottom: 12px; font-size: 13px; color: #2E4B33; line-height: 1.5; }}
        .feature-item:last-child {{ margin-bottom: 0; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #1B5E20, #2E7D32); color: #ffffff !important; text-decoration: none; padding: 14px 34px; border-radius: 14px; font-weight: 700; font-size: 14px; margin: 15px 0; text-align: center; box-shadow: 0 4px 18px rgba(46,125,50,0.3); }}
        .footer {{ background: #F6F8F4; padding: 26px 30px; text-align: center; font-size: 11px; color: #7D8C80; border-top: 1px solid #E2EAE0; line-height: 1.6; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">🌾 KrushiMitra | कृषीमित्र</h1>
          <div class="tagline">Smart AI Agriculture & Precision Farming Platform</div>
        </div>
        <div class="body">
          <h2 class="welcome-title">सस्नेह नमस्कार, {display_name} ji! 🙏</h2>
          <p>Welcome to <strong>KrushiMitra</strong>, your trusted AI-powered companion engineered for crop optimization, soil advisory, and high-yield precision farming in <strong>{dist_text}</strong>.</p>
          
          <div class="kisan-card">
            <div style="font-weight: 800; font-size: 13px; color: #1B5E20; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: space-between;">
              <span>🌾 Registered Farmer Dossier</span>
              <span class="badge">ACTIVE MEMBER</span>
            </div>
            <div class="kisan-row"><span class="kisan-label">🆔 Kisan Identification ID:</span> <span class="kisan-value">{kid_text}</span></div>
            <div class="kisan-row"><span class="kisan-label">👤 Farmer Name:</span> <span class="kisan-value">{display_name}</span></div>
            <div class="kisan-row"><span class="kisan-label">📧 Login Email:</span> <span class="kisan-value">{to_email}</span></div>
            <div class="kisan-row" style="margin-bottom:0;"><span class="kisan-label">📍 Agricultural District:</span> <span class="kisan-value">{dist_text}</span></div>
          </div>
          
          <div class="feature-card">
            <div style="font-weight: 800; font-size: 13px; color: #1B5E20; margin-bottom: 12px;">🌱 What You Can Do with KrushiMitra Right Now:</div>
            <div class="feature-item">🌿 <strong>Crop & Soil Recommendation:</strong> Input soil N-P-K, pH, and rainfall to discover the most profitable crops for your land.</div>
            <div class="feature-item">📈 <strong>AI Harvest Yield Forecasting:</strong> Predict exact harvest yields (in tonnes/hectare) using our machine learning models.</div>
            <div class="feature-item">🌦️ <strong>Microclimate Weather Alerts:</strong> Real-time temperature, humidity, rainfall forecasts, and ideal sowing dates.</div>
            <div class="feature-item">📄 <strong>Downloadable Agronomy PDF Reports:</strong> 1-click comprehensive soil and yield reports suitable for farm planning and credit applications.</div>
            <div class="feature-item">👨‍🌾 <strong>Agronomist Support & Feedback Desk:</strong> Ask direct agronomy queries and review responses from certified experts in your Settings tab.</div>
          </div>
          
          <div style="text-align: center; margin: 28px 0 20px 0;">
            <a href="{login_url}" class="btn">🚀 Login to Your Farmer Dashboard &rarr;</a>
          </div>
          
          <div style="background-color: #F8FAF7; border-radius: 12px; padding: 14px 18px; border: 1px dashed #C8E6C9; margin-top: 20px; font-size: 12px; color: #4B6350;">
            📞 <strong>24x7 Kisan Call Centre Helpline:</strong> 1800-180-1551 (Toll-Free, Multi-Language)<br>
            ✉️ <strong>Official Agronomist Support:</strong> krushimitra.project1@gmail.com
          </div>
        </div>
        <div class="footer">
          &copy; {datetime.now().year} KrushiMitra Precision Agriculture Platform. Built for Indian Farmers.<br>
          This official onboarding notification was dispatched to {to_email} upon registration.<br>
          KrushiMitra &bull; Maharashtra, India &bull; Made with pride for Krishi Vikas.
        </div>
      </div>
    </body>
    </html>
    """

    text_content = f"""
    Namaste {display_name} ji!
    
    Welcome to KrushiMitra - Smart AI Agriculture Platform.
    
    Your Farmer Account has been created successfully:
    - Kisan ID: {kid_text}
    - Farmer Name: {display_name}
    - Registered Email: {to_email}
    - District: {dist_text}
    
    Access your Farmer Dashboard here:
    {login_url}
    
    Core Tools:
    - Crop Recommendation & Soil Advisory
    - AI Harvest Yield Predictions
    - Live Weather & Sowing Window Alerts
    - Downloadable PDF Farm Reports
    - Official Agronomist Support Desk
    
    National Kisan Helpline: 1800-180-1551 (Toll-Free)
    Official Email: krushimitra.project1@gmail.com
    """

    return send_email_robust(to_email, subject, html_content, text_content, wait_timeout=wait_timeout)


def send_password_reset_email(to_email, user_name=None, reset_token="", reset_url=None, wait_timeout=5):
    """Sends a secure, 1-click password reset email with expiration notice."""
    if not reset_url:
        reset_url = f"{APP_URL}/?reset_token={reset_token}"

    subject = "🔒 Reset Your KrushiMitra Password"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F4F9F2; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #E2EAE0; }}
        .header {{ background: linear-gradient(135deg, #1B5E20, #2E7D32, #10B981); padding: 35px 30px; text-align: center; color: #ffffff; }}
        .logo {{ font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }}
        .body {{ padding: 35px 30px; color: #17291A; line-height: 1.6; }}
        .title {{ font-size: 20px; font-weight: 800; color: #1B5E20; margin-top: 0; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #1B5E20, #2E7D32); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 20px 0; text-align: center; box-shadow: 0 4px 15px rgba(46,125,50,0.25); }}
        .alert {{ background: #FFF8E1; border-left: 4px solid #FFA000; padding: 14px 18px; border-radius: 8px; font-size: 12px; color: #795548; margin: 20px 0; }}
        .footer {{ background: #F6F8F4; padding: 25px 30px; text-align: center; font-size: 11px; color: #7D8C80; border-top: 1px solid #E2EAE0; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">🌾 KrushiMitra</h1>
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9; margin-top: 5px;">Account Security Desk</div>
        </div>
        <div class="body">
          <h2 class="title">Password Reset Request</h2>
          <p>Dear User,</p>
          <p>We received a request to reset the password for your KrushiMitra account associated with <strong>{to_email}</strong>.</p>
          
          <p>Click the button below to set a new password. This secure link is valid for <strong>60 minutes</strong>:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="{reset_url}" class="btn">Reset My Password &rarr;</a>
          </div>
          
          <div class="alert">
            <strong>⏰ Security Notice:</strong> If you did not request this password reset, please ignore this email or contact support. Your password will remain unchanged.
          </div>
          
          <p style="font-size: 12px; color: #666;">Or copy and paste this link into your browser:<br>
            <span style="word-break: break-all; color: #2E7D32;">{reset_url}</span>
          </p>
        </div>
        <div class="footer">
          &copy; {datetime.now().year} KrushiMitra Precision Agriculture Platform. Built for Indian Kisans.<br>
          Sent securely to {to_email}.
        </div>
      </div>
    </body>
    </html>
    """

    text_content = f"""
    Dear User,
    
    We received a request to reset the password for your KrushiMitra account associated with {to_email}.
    
    Reset link (valid for 60 mins):
    {reset_url}
    
    If you did not request this, please ignore this message.
    """

    return send_email_robust(to_email, subject, html_content, text_content, wait_timeout=wait_timeout)


def send_ticket_notification_email(ticket, wait_timeout=3):
    """
    Sends an email notification to the administrator when a farmer submits a new inquiry or feedback.
    """
    admin_recipient = os.getenv("SMTP_EMAIL", "krushimitra.project1@gmail.com").strip()
    ticket_id = ticket.get("ticket_id") or "TICK"
    user_name = ticket.get("name") or "Farmer"
    user_email = ticket.get("user_email") or "Not provided"
    district = ticket.get("district") or "Maharashtra"
    category = ticket.get("category") or "General Inquiry"
    subject_text = ticket.get("subject") or "Farmer Query"
    message_text = ticket.get("message") or ""
    is_feedback = "feedback" in category.lower()

    email_subject = f"🌾 [KrushiMitra Helpdesk] New {'Feedback' if is_feedback else 'Agronomy Query'}: {subject_text} ({ticket_id})"
    admin_url = f"{APP_URL}/admin"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F4F9F2; margin: 0; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #DCE8D9; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }}
        .header {{ background: linear-gradient(135deg, #1B5E20, #2E7D32); padding: 26px; text-align: center; color: #ffffff; }}
        .content {{ padding: 28px 24px; color: #17291A; font-size: 14px; line-height: 1.6; }}
        .meta-box {{ background: #F8FAF7; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1.5px solid #C8E6C9; }}
        .meta-row {{ margin-bottom: 8px; font-size: 13px; display: flex; justify-content: space-between; }}
        .meta-label {{ color: #557258; font-weight: bold; }}
        .msg-box {{ background: #EAF7EC; border-left: 4px solid #2E7D32; padding: 14px 18px; border-radius: 8px; margin: 16px 0; font-style: italic; color: #1B5E20; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #1B5E20, #2E7D32); color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: bold; font-size: 13px; margin: 12px 0; }}
        .footer {{ background: #FAFCFA; padding: 18px; text-align: center; font-size: 11px; color: #7D8C80; border-top: 1px solid #E2EAE0; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin:0; font-size: 22px;">🌾 KrushiMitra Helpdesk Alert</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #C8E6C9; font-weight: bold;">New Farmer Inbound Communication</p>
        </div>
        <div class="content">
          <p>A new farmer inquiry has just been submitted on the KrushiMitra platform:</p>
          <div class="meta-box">
            <div class="meta-row"><span class="meta-label">🆔 Ticket ID:</span> <strong>{ticket_id}</strong></div>
            <div class="meta-row"><span class="meta-label">👤 Farmer:</span> <strong>{user_name}</strong></div>
            <div class="meta-row"><span class="meta-label">📧 Email:</span> {user_email}</div>
            <div class="meta-row"><span class="meta-label">📍 District:</span> {district}</div>
            <div class="meta-row"><span class="meta-label">📂 Category:</span> {category}</div>
            <div class="meta-row" style="margin-bottom:0;"><span class="meta-label">📌 Subject:</span> <strong>{subject_text}</strong></div>
          </div>
          <p><strong>Query Message:</strong></p>
          <div class="msg-box">"{message_text}"</div>
          <div style="text-align: center; margin: 20px 0;">
            <a href="{admin_url}" class="btn">🚀 Open Admin Helpdesk to Review &amp; Reply &rarr;</a>
          </div>
        </div>
        <div class="footer">
          KrushiMitra Automated Helpdesk Dispatcher &bull; Maharashtra, India
        </div>
      </div>
    </body>
    </html>
    """

    return send_email_robust(admin_recipient, email_subject, html_content, message_text, wait_timeout=wait_timeout)

