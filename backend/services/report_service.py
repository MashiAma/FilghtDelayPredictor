from sqlalchemy.orm import Session
from models_sql.prediction import Prediction
from datetime import datetime
from models_sql.flight import Flight
from sqlalchemy import func
from typing import Optional
from fastapi import HTTPException, Query
from zoneinfo import ZoneInfo
from datetime import timezone

#Reports

def get_user_predictions_by_period(
    db: Session,
    user_email: Optional[str] = None,
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
):
    # Join with Flight
    query = db.query(Prediction).join(Prediction.flight)

    # Filter by user email
    query = query.filter(Prediction.user_email == user_email)

    # Filter by date
    if from_date and to_date:
        query = query.filter(
            Prediction.created_at >= from_date,
            Prediction.created_at <= to_date
        )

    predictions = query.order_by(Prediction.created_at.desc()).all()

    results = []
    on_time = minor = major = 0

    for p in predictions:
        flight = getattr(p, "flight", None)

        # Count delay classes
        if p.delay_class_dep == "On-time":
            on_time += 1
        elif p.delay_class_dep == "Minor":
            minor += 1
        elif p.delay_class_dep == "Major":
            major += 1

        results.append({
            "prediction_id": p.id,
            "user_email": p.user_email,
            "delay_class_dep": p.delay_class_dep,
            "dep_probability": p.dep_probability if p.dep_probability else 0,
            "created_at": (
                p.created_at
                .replace(tzinfo=timezone.utc)
                .astimezone(ZoneInfo("Asia/Colombo"))
                .strftime("%Y-%m-%d %H:%M")
            ),
            "flight": {
                "airline": flight.airline if flight else None,
                "aircraft": flight.aircraft if flight else None,
                "origin": flight.departure_airport if flight else None,
                "destination": flight.arrival_airport if flight else None,
                "scheduled_departure": flight.scheduled_departure if flight else None,
                "scheduled_arrival": flight.scheduled_arrival if flight else None,
            }
        })

    return {
        "total_predictions": len(results),
        "on_time_count": on_time,
        "minor_count": minor,
        "major_count": major,
        "predictions": results
    }


def get_users_report(
    db: Session,
    airline: Optional[str] = None,
    aircraft: Optional[str] = None,
    destination: Optional[str] = None,
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
):

    # Single join using relationship
    query = db.query(Prediction).join(Prediction.flight)

    # Date filter
    if from_date and to_date:
        query = query.filter(
            Prediction.created_at >= from_date,
            Prediction.created_at <= to_date
        )

    # Flight filters (no new join!)
    if airline:
        query = query.filter(Flight.airline == airline)
    if aircraft:
        query = query.filter(Flight.aircraft == aircraft)
    if destination:
        query = query.filter(Flight.arrival_airport == destination)

    predictions = query.all()

    results = []

    for p in predictions:
        flight = p.flight

        results.append({
            "prediction_id": p.id,
            "user_email": p.user_email,

            "delay_class_dep": p.delay_class_dep,
            "dep_probability": p.dep_probability if p.dep_probability else 0,
            "created_at": (
                p.created_at
                .replace(tzinfo=timezone.utc)
                .astimezone(ZoneInfo("Asia/Colombo"))
                .strftime("%Y-%m-%d %H:%M")
            ),

            "flight": {
                "airline": flight.airline if flight else None,
                "aircraft": flight.aircraft if flight else None,
                "origin": flight.departure_airport if flight else None,
                "destination": flight.arrival_airport if flight else None,
                "scheduled_departure": flight.scheduled_departure if flight else None,
                "scheduled_arrival": flight.scheduled_arrival if flight else None,
            }
        })

    return {
        "total_predictions": len(results),
        "predictions": results
    }