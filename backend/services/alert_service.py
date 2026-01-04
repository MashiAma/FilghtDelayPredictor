from sqlalchemy.orm import Session
from models_sql.alert import Alert
from utils.email_utils import send_email_alert

def create_alert(db: Session, user_id: int, title: str, message: str):
    """
    Create a new alert in the database and send email notification.
    """
    alert = Alert(user_id=user_id, title=title, message=message, read=False)
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Send email notification
    # Assuming you have User model with email
    from models_sql.user import User
    user = db.query(User).filter(User.id == user_id).first()
    if user and user.email:
        send_email_alert(
            to_email=user.email,
            subject=f"Flight Delay Alert: {title}",
            body=message
        )

    return alert


def get_user_alerts(db: Session, user_id: int):
    """
    Retrieve all alerts for a user
    """
    return db.query(Alert).filter(Alert.user_id == user_id).all()


def mark_alert_as_read(db: Session, alert_id: int):
    """
    Mark a specific alert as read
    """
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.read = True
        db.commit()
        db.refresh(alert)
    return alert
