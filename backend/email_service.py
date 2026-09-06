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
    """Dynamically reads SMTP settings from environment on each invocation."""
    server = os.getenv("SMTP_SERVER", "smtp.gmail.com").strip()
    port = int(os.getenv("SMTP_PORT", "587"))
    email = os.getenv("SMTP_EMAIL", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    return server, port, email, password


def is_smtp_configured():
    """Checks if real SMTP credentials are provided in .env."""
    _, _, email, password = get_smtp_config()
    return bool(email and password and email != "your-email@gmail.com")


def _send_email_async(to_email, subject, html_content, text_content=None):
    """Sends email asynchronously in a background thread to prevent API blocking."""
    def worker():
        try:
            server_host, port, sender_email, sender_password = get_smtp_config()

            if not is_smtp_configured():
                # Dev / Offline Simulation Mode
                log_entry = {
                    "to": to_email,
                    "subject": subject,
                    "html": html_content,
                    "text": text_content or "",
                    "timestamp": datetime.now().isoformat(),
                    "simulated": True
                }
                RECENT_SENT_EMAILS.append(log_entry)
                if len(RECENT_SENT_EMAILS) > 50:
                    RECENT_SENT_EMAILS.pop(0)
                
                print(f"[EMAIL SERVICE (SIMULATION)] Mail logged for: {to_email}")
                print(f"[EMAIL SERVICE (SIMULATION)] Subject: {subject}")
                return True

            msg = MIMEMultipart("alternative")
            msg["Subject"] = Header(subject, "utf-8")
            msg["From"] = formataddr((str(Header(APP_NAME, "utf-8")), sender_email))
            msg["To"] = to_email

            if text_content:
                msg.attach(MIMEText(text_content, "plain", "utf-8"))
            msg.attach(MIMEText(html_content, "html", "utf-8"))

            server = smtplib.SMTP(server_host, port, timeout=25)
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
                "simulated": False
            }
            RECENT_SENT_EMAILS.append(log_entry)
            print(f"[EMAIL SERVICE] Real SMTP Email successfully sent to: {to_email}")
            return True

        except Exception as e:
            print(f"[EMAIL SERVICE ERROR] Failed to send email to {to_email}: {e}")
            RECENT_SENT_EMAILS.append({
                "to": to_email,
                "subject": subject,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "simulated": True
            })
            return False

    thread = threading.Thread(target=worker, daemon=True)
    thread.start()
    return thread


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


def send_welcome_email(to_email, user_name=None, district="Maharashtra", kisan_id=None, phone=None):
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

    return _send_email_async(to_email, subject, html_content, text_content)


def send_password_reset_email(to_email, user_name=None, reset_token="", reset_url=None):
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

    _send_email_async(to_email, subject, html_content, text_content)
    return True
