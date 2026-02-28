from sqlalchemy.orm import Session
from models_sql.alert import Alert
from models_sql.user import User
from utils.email_utils import send_email_alert

# Threshold for high delay probability
HIGH_RISK_THRESHOLD = 0.90  # 30%

def trigger_delay_alert(
    db: Session,
    user_email: str,
    flight_id: int,
    probability: float,
    delay_class: int
) -> Alert | None:
    """
    Trigger a delay alert for a flight if the predicted probability exceeds HIGH_RISK_THRESHOLD.
    Creates a database entry and sends an email notification.
    """

    # Step 1: Get user from database
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        print(f"Alert trigger failed: User with email {user_email} not found")
        return None

    # Step 2: Only trigger if probability exceeds threshold
    if probability < HIGH_RISK_THRESHOLD:
        return None

    # Step 3: Create alert message
    title = "High Delay Risk Detected"
    message = (
        f"Flight ID {flight_id} has a high delay probability.\n\n"
        f"Predicted Probability: {round(probability * 100, 2)}%\n"
        f"Severity Level: {delay_class}\n\n"
        "Please review AI insights in your dashboard."
    )

    # Step 4: Create alert object
    alert = Alert(
        user_id=user.id,
        flight_id=flight_id,
        title=title,
        message=message,
        is_read=False
    )

    # Step 5: Commit safely
    try:
        db.add(alert)
        db.commit()
        db.refresh(alert)
    except Exception as e:
        db.rollback()
        print("Database commit failed for alert:", e)
        return None

    # Step 6: Send email
    if user.email:
        try:
            send_email_alert(
                to_email=user.email,
                subject="SkyGuard - High Delay Risk Alert",
                body=message
            )
        except Exception as e:
            print("Email sending failed:", e)

    return alert