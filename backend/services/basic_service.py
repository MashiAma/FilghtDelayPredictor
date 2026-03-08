from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime,timedelta
from models_sql.user import User
from models_sql.prediction import Prediction
from models_sql.flight import Flight
from models_sql.holiday import Holiday  # you must create this table


# =========================
# HELPER
# =========================

def get_current_month_range():
    now = datetime.utcnow()
    start = datetime(now.year, now.month, 1)

    if now.month == 12:
        end = datetime(now.year + 1, 1, 1)
    else:
        end = datetime(now.year, now.month + 1, 1)

    return start, end


# =========================
# KPI SERVICE
# =========================

def get_admin_stats_service(db: Session):

    start, end = get_current_month_range()

    total_users = db.query(func.count(User.id)).scalar() or 0
    total_predictions = db.query(func.count(Prediction.id)).scalar() or 0

    predictions_this_month = db.query(func.count(Prediction.id)).filter(
        Prediction.created_at >= start,
        Prediction.created_at < end
    ).scalar() or 0

    flights_this_month = db.query(func.count(Flight.id)).filter(
        Flight.created_at >= start,   # use correct date column
        Flight.created_at < end
    ).scalar() or 0

    high_risk_count = db.query(func.count(Prediction.id)).filter(
        Prediction.delay_class_dep == "High"
    ).scalar() or 0

    high_risk_percentage = (
        (high_risk_count / total_predictions) * 100
        if total_predictions else 0
    )

    avg_probability = db.query(
        func.avg(Prediction.dep_probability)
    ).scalar() or 0

    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "predictions_this_month": predictions_this_month,
        "flights_this_month": flights_this_month,
        "high_risk_percentage": round(high_risk_percentage, 2),
        "average_probability": round(avg_probability, 2)
    }


# =========================
# USER ROLE PIE CHART
# =========================

def get_user_role_distribution_service(db: Session):
    data = db.query(
        User.role,
        func.count(User.id)
    ).group_by(User.role).all()

    return {
        "labels": [d[0] for d in data],
        "values": [float(d[1]) for d in data]
    }


# =========================
# MONTHLY HIGH RISK BAR CHART
# =========================

DELAY_CLASSES = ["On-time", "Delayed"]  # adjust according to your system

def get_delay_distribution_service(db: Session):

    start, end = get_current_month_range()

    data = db.query(
        Prediction.delay_class_dep,
        func.count(Prediction.id)
    ).filter(
        Prediction.created_at >= start,
        Prediction.created_at < end
    ).group_by(
        Prediction.delay_class_dep
    ).all()

    counts = {d[0]: d[1] for d in data}

    labels = []
    values = []

    for cls in DELAY_CLASSES:
        labels.append(cls)
        values.append(float(counts.get(cls, 0)))

    return {
        "labels": labels,
        "values": values
    }

# =========================
# LAST 10 PREDICTIONS
# =========================

def get_last_10_predictions_service(db: Session):

    predictions = (
        db.query(Prediction)
        .join(Flight, Flight.id == Prediction.flight_id)
        .order_by(Prediction.created_at.desc())
        .limit(10)
        .all()
    )

    results = []

    for p in predictions:
        route = f"{p.flight.departure_airport} → {p.flight.arrival_airport}"

        results.append({
            "user_email": p.user_email,   # directly from Prediction
            "route": route,
            "probability": round(p.dep_probability or 0, 2),
            "risk_level": p.delay_class_dep,
            "created_at": p.created_at
        })

    return {
        "total": len(results),
        "predictions": results
    }


# =========================
# UPCOMING HOLIDAYS (THIS MONTH)
# =========================

def get_current_month_holidays_service(db: Session):

    start, end = get_current_month_range()

    holidays = db.query(Holiday).filter(
        Holiday.holiday_date >= start,
        Holiday.holiday_date < end
    ).all()

    return {
        "holidays": [
            {
                "name": h.holiday_name,
                "date": h.holiday_date,
                "type": h.holiday_type
            }
            for h in holidays
        ]
    }

def get_tomorrow_flights_service(db: Session):
    # Calculate tomorrow's date (UTC)
    today = datetime.utcnow().date()
    tomorrow = today + timedelta(days=1)

    # Filter flights where scheduled_departure is on tomorrow's date
    flights = db.query(Flight).filter(
        func.date(Flight.scheduled_departure) == tomorrow
    ).all()

    results = []
    for f in flights:
        results.append({
            "flight_number": f.flight_number,
            "departure_airport": f.departure_airport,
            "arrival_airport": f.arrival_airport,
            "scheduled_departure": f.scheduled_departure,
            "scheduled_arrival": f.scheduled_arrival,
            "airline": f.airline,
            "status": f.status,
            "aircraft": f.aircraft
        })

    return {
        "date": tomorrow,
        "total_flights": len(results),
        "flights": results
    }