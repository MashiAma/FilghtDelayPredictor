from sqlalchemy.orm import Session
from models_sql.alert import Alert
from models_sql.user import User
from models_sql.flight import Flight
from utils.email_utils import send_email_alert
from datetime import datetime
from zoneinfo import ZoneInfo


# Threshold for high delay probability
HIGH_RISK_THRESHOLD = 0.50  # 30%
today_date = datetime.now(ZoneInfo("Asia/Colombo"))
today = today_date.strftime("%d %b %Y %H:%M")
dashboard_link="http://localhost:5174/"

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

    username = user.full_name
    # Step 2: Only trigger if probability exceeds threshold
    if probability < HIGH_RISK_THRESHOLD:
        return None

    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        print(f"Flight with ID {flight_id} not found")
        return None

    airline = flight.airline
    origin = flight.departure_airport
    destination = flight.arrival_airport
    departure_time = flight.scheduled_departure.strftime("%d %b %Y %H:%M")

    # Step 3: Create alert message
    title = "High Delay Risk Detected"
    message = f"""<html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">

          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 10px;">
            <img src="cid:logo" alt="SkyGuard" style="height: 60px;">
          </div>

          <!-- Date -->
          <p style="text-align: right; color: #555; font-size: 12px;">Date: {today}</p>

          <!-- Header -->
          <h2 style="color: #1a73e8; text-align: center;">Automated Flight Delay Alert</h2>

          <!-- Greeting -->
          <p>Dear {username},</p>
          <p>Our SkyGuard system has detected that your upcoming flight has a <strong>high probability of delay</strong>.</p>

          <!-- Flight Details -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr>
              <td style="font-weight: bold; padding: 5px;">Airline:</td>
              <td style="padding: 5px;">{airline}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Origin:</td>
              <td style="padding: 5px;">{origin}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Destination:</td>
              <td style="padding: 5px;">{destination}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Scheduled Departure Time:</td>
              <td style="padding: 5px;">{departure_time}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Predicted Delay Probability:</td>
              <td style="padding: 5px;">{round(probability * 100, 2)}%</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Severity Level:</td>
              <td style="padding: 5px;">{delay_class}</td>
            </tr>
          </table>

          <!-- Message -->
          <p>Please review your flight plans and check the SkyGuard dashboard for detailed operational LLM-based delay explanations, insights and recommendations.</p><br></br>

          <!-- Footer / Disclaimer -->
          <p style="margin-top: 20px; font-size: 12px; color: #555;">
            This is an <strong>automated message</strong>. Please do not reply to this email.<br></br>
            For support or questions, visit <a href="">SkyGuard Support</a>.
          </p>

          <p style="margin-top: 10px; font-size: 12px; color: #777;">
            SkyGuard &copy; 2026. All rights reserved.
          </p>
        </div>
      </body>
    </html>
    """

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
                subject="⚠️ SkyGuard - Flight Delay Risk Alert",
                body=message,
                logo_path="assets/logo.png"
            )
        except Exception as e:
            print("Email sending failed:", e)

    return alert