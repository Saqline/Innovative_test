import smtplib
from email.mime.text import MIMEText
from app.core.config import settings

def send_email(to_email: str, subject: str, body: str):
    print("Sending email to:", to_email)
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_USER
    msg["To"] = to_email

    with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
        server.starttls()
        server.login(settings.EMAIL_USER, settings.EMAIL_PASS)
        server.sendmail(settings.EMAIL_USER, to_email, msg.as_string())
