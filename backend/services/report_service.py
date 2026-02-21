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
            "delay_class_arr": p.delay_class_arr,
            "arr_probability": p.arr_probability if p.arr_probability else 0,
            "predicted_dep_delay_min": p.predicted_dep_delay_min,
            "predicted_arr_delay_min": p.predicted_arr_delay_min,
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

            "delay_class_arr": p.delay_class_arr,
            "arr_probability": p.arr_probability if p.arr_probability else 0,

            "predicted_dep_delay_min": p.predicted_dep_delay_min,
            "predicted_arr_delay_min": p.predicted_arr_delay_min,

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

def get_operational_report(db: Session, start_date: datetime, end_date: datetime):

    base_query = db.query(Prediction).filter(
        Prediction.created_at >= start_date,
        Prediction.created_at <= end_date
    )

    total_predictions = base_query.count()

    delay_distribution_query = db.query(
        Prediction.delay_class_dep,
        func.count(Prediction.id).label("count")
    ).filter(
        Prediction.created_at >= start_date,
        Prediction.created_at <= end_date
    ).group_by(Prediction.delay_class_dep).all()

    airline_delays_query = db.query(
        Flight.airline,
        func.count(Prediction.id).label("total"),
        func.avg(Prediction.dep_probability).label("avg_probability")
    ).join(Flight).filter(
        Prediction.created_at >= start_date,
        Prediction.created_at <= end_date
    ).group_by(Flight.airline).all()

    # Convert to JSON serializable format
    delay_distribution = [
        {
            "delay_class": row.delay_class_dep,
            "count": row.count
        }
        for row in delay_distribution_query
    ]

    airline_performance = [
        {
            "airline": row.airline,
            "total_predictions": row.total,
            "avg_probability": float(row.avg_probability) if row.avg_probability else 0
        }
        for row in airline_delays_query
    ]

    return {
        "total_predictions": total_predictions,
        "delay_distribution": delay_distribution,
        "airline_performance": airline_performance
    }