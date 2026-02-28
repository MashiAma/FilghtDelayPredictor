from sqlalchemy.orm import Session
from sqlalchemy import func
from models_sql.prediction import Prediction
from models_sql.flight import Flight
from datetime import date
from typing import Dict, Any, List

HOUR_LABELS = {
    (0, 5): "Late Night",
    (6, 8): "Early Morning",
    (9, 11): "Morning",
    (12, 14): "Early Afternoon",
    (15, 17): "Afternoon",
    (18, 20): "Evening",
    (21, 23): "Night",
}


def get_hour_label(hour: int) -> str:
    for (start, end), label in HOUR_LABELS.items():
        if start <= hour <= end:
            return label
    return "Unknown"


def get_time_slot_recommendations(
    db: Session,
    origin: str,
    destination: str,
) -> List[Dict]:
    results = (
        db.query(
            func.extract('hour', Flight.scheduled_departure).label("hour"),
            func.avg(Prediction.dep_probability).label("avg_risk"),
            func.count(Prediction.id).label("sample_count")
        )
        .join(Flight, Prediction.flight_id == Flight.id)
        .filter(
            Flight.departure_airport == origin,
            Flight.arrival_airport == destination,
        )
        .group_by(func.extract('hour', Flight.scheduled_departure))
        .order_by(func.avg(Prediction.dep_probability))
        .all()
    )

    slots = []
    for row in results:
        hour = int(row.hour)
        risk = float(row.avg_risk) if row.avg_risk else 0.5
        label = get_hour_label(hour)
        recommendation = (
            "Low risk — good time to depart" if risk < 0.3
            else "Moderate risk — acceptable" if risk < 0.6
            else "High risk — consider alternative time"
        )
        slots.append({
            "hour": hour,
            "label": f"{hour:02d}:00 ({label})",
            "estimated_delay_risk": round(risk, 3),
            "recommendation": recommendation,
            "sample_count": int(row.sample_count)
        })

    return slots


def get_best_day_of_week(db: Session, origin: str, destination: str) -> str:
    result = (
        db.query(
            func.extract('dow', Flight.scheduled_departure).label("dow"),
            func.avg(Prediction.dep_probability).label("avg_risk")
        )
        .join(Flight, Prediction.flight_id == Flight.id)
        .filter(
            Flight.departure_airport == origin,
            Flight.arrival_airport == destination,
        )
        .group_by(func.extract('dow', Flight.scheduled_departure))
        .order_by(func.avg(Prediction.dep_probability))
        .first()
    )

    if result:
        dow_map = {
            7: "Sunday", 1: "Monday", 2: "Tuesday",
            3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"
        }
        return dow_map.get(int(result.dow), "Tuesday")
    return "Tuesday"


def get_best_airline(db: Session, origin: str, destination: str) -> str:
    result = (
        db.query(
            Flight.airline,
            func.avg(Prediction.dep_probability).label("avg_risk")
        )
        .join(Prediction, Prediction.flight_id == Flight.id)
        .filter(
            Flight.departure_airport == origin,
            Flight.arrival_airport == destination,
        )
        .group_by(Flight.airline)
        .order_by(func.avg(Prediction.dep_probability))
        .first()
    )
    return result.airline if result else None


def build_recommendations(
    db: Session,
    origin: str,
    destination: str,
    airline: str,
) -> Dict[str, Any]:

    slots = get_time_slot_recommendations(db, origin, destination)
    best_day = get_best_day_of_week(db, origin, destination)
    best_airline = get_best_airline(db, origin, destination)
    best_slot = min(slots, key=lambda x: x["estimated_delay_risk"]) if slots else None

    summary_parts = []
    if best_slot:
        avg_risk = sum(s["estimated_delay_risk"] for s in slots) / len(slots)
        if avg_risk > 0:
            pct_better = round(
                (avg_risk - best_slot["estimated_delay_risk"]) / avg_risk * 100
            )
            summary_parts.append(
                f"Flights departing around {best_slot['hour']:02d}:00 show "
                f"{pct_better}% lower delay risk on this route."
            )
    if best_day:
        summary_parts.append(
            f"{best_day}s historically have the lowest delay rates on this route."
        )
    if best_airline and best_airline != airline:
        summary_parts.append(
            f"{best_airline} shows better on-time performance on this route."
        )

    return {
        "best_departure_hour": best_slot["hour"] if best_slot else 10,
        "best_departure_label": best_slot["label"] if best_slot else "10:00 (Morning)",
        "best_day_of_week": best_day,
        "best_airline": best_airline,
        "time_slots": slots,
        "summary": " ".join(summary_parts) or "Insufficient historical data for recommendations."
    }