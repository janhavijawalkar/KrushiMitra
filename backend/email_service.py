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


def send_welcome_email(to_email, user_name=None, district="Maharashtra"):
    """Sends an official branded Welcome email to newly registered farmers."""
    subject = "🌾 Welcome to KrushiMitra! Your Smart Farming Journey Begins"
    dist_text = district if district and str(district).strip() else "Maharashtra"
    
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
        .tagline {{ font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9; margin-top: 5px; }}
        .body {{ padding: 35px 30px; color: #17291A; line-height: 1.6; }}
        .welcome-title {{ font-size: 20px; font-weight: 800; color: #1B5E20; margin-top: 0; }}
        .card {{ background: #F6F8F4; border-radius: 14px; padding: 20px; margin: 20px 0; border: 1px solid #E2EAE0; }}
        .card-item {{ margin-bottom: 12px; }}
        .card-item:last-child {{ margin-bottom: 0; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #1B5E20, #2E7D32); color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 12px; font-weight: 700; font-size: 14px; margin-top: 15px; text-align: center; box-shadow: 0 4px 15px rgba(46,125,50,0.25); }}
        .footer {{ background: #F6F8F4; padding: 25px 30px; text-align: center; font-size: 11px; color: #7D8C80; border-top: 1px solid #E2EAE0; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">🌾 KrushiMitra</h1>
          <div class="tagline">Smart AI Agriculture & Decision Support</div>
        </div>
        <div class="body">
          <h2 class="welcome-title">Namaste! 🙏</h2>
          <p>Dear User,</p>
          <p>Welcome to <strong>KrushiMitra</strong>, your trusted AI-powered companion for precision farming and harvest optimization in <strong>{dist_text}</strong>.</p>
          
          <p>Your farmer account has been created successfully. Here is what you can do right now:</p>
          
          <div class="card">
            <div style="font-weight: 700; font-size: 13px; color: #1B5E20; margin-bottom: 10px;">🌟 Core Farming Tools at Your Fingertips:</div>
            <div class="card-item">🌱 <strong>Soil & Crop Recommendation:</strong> Test your soil nutrients (N-P-K, pH) to find the most profitable crop.</div>
            <div class="card-item">📈 <strong>Yield Prediction:</strong> Predict exact harvest output (in tonnes/ha) based on district rainfall and land acreage.</div>
            <div class="card-item">🌦️ <strong>Microclimate Weather:</strong> Real-time weather alerts and optimal sowing windows for your exact farm location.</div>
            <div class="card-item">📄 <strong>Downloadable Farm PDF Reports:</strong> 1-click official agronomic reports for bank loans and crop insurance.</div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{APP_URL}" class="btn">Access Your Farmer Dashboard &rarr;</a>
          </div>
          
          <p style="font-size: 12px; color: #666;">Need help? Call the National Kisan Helpline: <strong>1800-180-1551</strong> or reply directly to our agronomy support desk.</p>
        </div>
        <div class="footer">
          &copy; {datetime.now().year} KrushiMitra Precision Agriculture Platform. Built for Indian Kisans.<br>
          This email was sent to {to_email} because you registered on KrushiMitra.
        </div>
      </div>
    </body>
    </html>
    """

    text_content = f"""
    Namaste!
    
    Dear User,
    Welcome to KrushiMitra - Smart AI Agriculture Platform.
    
    Your farmer account has been created for {dist_text}.
    Access your dashboard here: {APP_URL}
    
    - Soil & Crop Advisory
    - AI Harvest Yield Predictions
    - Live Weather & Sowing Alerts
    - Downloadable Farm Reports (PDF)
    
    Kisan Helpline: 1800-180-1551
    """

    _send_email_async(to_email, subject, html_content, text_content)
    return True


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
