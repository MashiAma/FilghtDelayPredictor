# backend/utils/email_utils.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
from email.mime.image import MIMEImage

def send_email_alert(to_email: str, subject: str, body: str,logo_path: str = None):
    """
    Send an email alert to the user.
    
    :param to_email: Recipient's email
    :param subject: Email subject
    :param body: Email body (HTML or plain text)
    """
    # Create the email message
    msg = MIMEMultipart('related')  # allows HTML + embedded images
    msg['From'] = SMTP_FROM
    msg['To'] = to_email
    msg['Subject'] = subject

    html_body = MIMEMultipart('alternative')
    html_body.attach(MIMEText(body, 'html'))
    msg.attach(html_body)

    # Attach logo if provided
    if logo_path:
        try:
            with open(logo_path, 'rb') as f:
                img = MIMEImage(f.read())
                img.add_header('Content-ID', '<logo>')  # reference in HTML
                img.add_header('Content-Disposition', 'inline', filename='logo.png')
                msg.attach(img)
        except Exception as e:
            print(f"Failed to attach logo: {e}")

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