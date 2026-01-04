# backend/utils/email_utils.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM

def send_email_alert(to_email: str, subject: str, body: str):
    """
    Send an email alert to the user.
    
    :param to_email: Recipient's email
    :param subject: Email subject
    :param body: Email body (HTML or plain text)
    """
    # Create the email message
    msg = MIMEMultipart()
    msg['From'] = SMTP_FROM
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach body as plain text (you can also send HTML)
    msg.attach(MIMEText(body, 'plain'))

    # Connect to SMTP server
    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()  # Secure connection
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
    finally:
        server.quit()
