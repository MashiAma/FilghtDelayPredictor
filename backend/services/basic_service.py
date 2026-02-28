from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime
from models_sql.flight import Flight
from models_sql.prediction import Prediction
from models_sql.user import User


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

    # Total Flights Current Month
    total_flights = db.query(func.count(Flight.id)).filter(
        Flight.scheduled_departure >= start,
        Flight.scheduled_departure < end
    ).scalar() or 0

    # Total Predictions Current Month
    total_predictions = db.query(func.count(Prediction.id)).join(
        Flight, Flight.id == Prediction.flight_id
    ).filter(
        Flight.scheduled_departure >= start,
        Flight.scheduled_departure < end
    ).scalar() or 0

    # Total Users
    total_users = db.query(func.count(User.id)).scalar() or 0

    # Delay Rate
    total_preds = db.query(func.count(Prediction.id)).scalar() or 0

    delayed_preds = db.query(func.count(Prediction.id)).filter(
        Prediction.delay_class_dep == "Delayed"
    ).scalar() or 0

    delay_rate = (delayed_preds / total_preds * 100) if total_preds else 0

    # Most Delayed Airline
    most_delayed = db.query(
        Flight.airline,
    ).join(Prediction, Flight.id == Prediction.flight_id) \
     .group_by(Flight.airline) \
     .first()

    return {
        "total_flights_current_month": total_flights,
        "total_predictions_current_month": total_predictions,
        "total_users": total_users,
        # "average_departure_delay": round(avg_delay, 2),
        "delay_rate_percent": round(delay_rate, 2),
        "most_delayed_airline": most_delayed[0] if most_delayed else None
    }


def get_delay_distribution_service(db: Session):
    data = db.query(
        Prediction.delay_class_dep,
        func.count(Prediction.id)
    ).group_by(Prediction.delay_class_dep).all()

    return {
        "labels": [d[0] for d in data],
        "values": [float(d[1]) for d in data]
    }


def get_delay_by_airline_service(db: Session):
    data = db.query(
        Flight.airline,
    ).join(Prediction, Flight.id == Prediction.flight_id) \
     .group_by(Flight.airline).all()

    return {
        "labels": [d[0] for d in data],
        "values": [round(d[1], 2) for d in data]
    }


def get_delay_by_hour_service(db: Session):
    data = db.query(
        extract("hour", Flight.scheduled_departure),
    ).join(Prediction, Flight.id == Prediction.flight_id) \
     .group_by(extract("hour", Flight.scheduled_departure)) \
     .order_by(extract("hour", Flight.scheduled_departure)) \
     .all()

    return {
        "labels": [str(int(d[0])) for d in data],
        "values": [round(d[1], 2) for d in data]
    }


def get_delay_trend_service(db: Session):
    data = db.query(
        func.date(Flight.scheduled_departure),
    ).join(Prediction, Flight.id == Prediction.flight_id) \
     .group_by(func.date(Flight.scheduled_departure)) \
     .order_by(func.date(Flight.scheduled_departure)) \
     .all()

    return {
        "labels": [str(d[0]) for d in data],
        "values": [round(d[1], 2) for d in data]
    }

# def get_users_report(
#     db: Session,
#     airline: Optional[str] = None,
#     aircraft: Optional[str] = None,
#     destination: Optional[str] = None,
#     from_date: Optional[datetime] = Query(None),
#     to_date: Optional[datetime] = Query(None),
# ):

#     # Single join using relationship
#     query = db.query(Prediction).join(Prediction.flight)

#     # Date filter
#     if from_date and to_date:
#         query = query.filter(
#             Prediction.created_at >= from_date,
#             Prediction.created_at <= to_date
#         )

#     # Flight filters (no new join!)
#     if airline:
#         query = query.filter(Flight.airline == airline)
#     if aircraft:
#         query = query.filter(Flight.aircraft == aircraft)
#     if destination:
#         query = query.filter(Flight.arrival_airport == destination)

#     predictions = query.all()

#     results = []

#     for p in predictions:
#         flight = p.flight

#         results.append({
#             "prediction_id": p.id,
#             "user_email": p.user_email,

#             "delay_class_dep": p.delay_class_dep,
#             "dep_probability": p.dep_probability if p.dep_probability else 0,



#             "created_at": (
#                 p.created_at
#                 .replace(tzinfo=timezone.utc)
#                 .astimezone(ZoneInfo("Asia/Colombo"))
#                 .strftime("%Y-%m-%d %H:%M")
#             ),

#             "flight": {
#                 "airline": flight.airline if flight else None,
#                 "aircraft": flight.aircraft if flight else None,
#                 "origin": flight.departure_airport if flight else None,
#                 "destination": flight.arrival_airport if flight else None,
#                 "scheduled_departure": flight.scheduled_departure if flight else None,
#                 "scheduled_arrival": flight.scheduled_arrival if flight else None,
#             }
#         })

#     return {
#         "total_predictions": len(results),
#         "predictions": results
#     }