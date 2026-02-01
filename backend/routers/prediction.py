from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models_sql.flight import Flight
from models_sql.prediction import Prediction
from database.connection import get_db
from datetime import datetime, date, time
from services.prediction_service import (
    predict
    # add_prediction,
    # get_predictions_by_flight,
    # get_latest_prediction,
    # delete_prediction
)
from schemas.prediction import PredictionRequest
# PredictionCreate, PredictionOut
from services.weather_service import get_weather_features
from services.holiday_service import get_holiday_features
from services.feature_builder import build_time_features
from services.prediction_service import predict

router = APIRouter()

def combine_date_time(d: datetime.date, t: datetime.time) -> datetime:
    """Combine date and time into a single datetime object."""
    return datetime.combine(d, t)

@router.post("/")
def predict_delay(payload: PredictionRequest, db: Session = Depends(get_db)):
    dep_dt = combine_date_time(payload.departure_date, payload.departure_time)

    # 🔹 Find flight
    flight_q = db.query(Flight).filter(
        Flight.arrival_airport == payload.arrival_airport,
        Flight.scheduled_departure == dep_dt
    )
    if payload.flight_number:
        flight_q = flight_q.filter(Flight.flight_number == payload.flight_number)

    flight = flight_q.first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")

    # 🔹 Gather features
    dep_weather = get_weather_features(flight.departure_airport, dep_dt)
    arr_weather = get_weather_features(flight.arrival_airport, flight.scheduled_arrival)
    holiday = get_holiday_features(db, dep_dt.date())
    time_features = build_time_features(dep_dt, flight.scheduled_arrival)

    additional_features = {
        "scheduled_flight_duration_min": (flight.scheduled_arrival - dep_dt).total_seconds() / 60,
        "route_avg_delay": getattr(flight, "route_avg_delay", 0),
        "route_delay_rate": getattr(flight, "route_delay_rate", 0),
        "airline_avg_delay": getattr(flight, "airline_avg_delay", 0),
        "airline_delay_rate": getattr(flight, "airline_delay_rate", 0),
        "aircraft_avg_delay": getattr(flight, "aircraft_avg_delay", 0),
        "is_short_haul": getattr(flight, "is_short_haul", 0),
        "scheduled_departure_hour": flight.scheduled_departure.hour,
        "scheduled_arrival_hour": flight.scheduled_arrival.hour,
        "scheduled_departure_day_of_week": flight.scheduled_departure.weekday(),
        "scheduled_arrival_day_of_week": flight.scheduled_arrival.weekday(),
        "scheduled_is_weekend": 1 if flight.scheduled_departure.weekday() >= 5 else 0,
        "scheduled_month": flight.scheduled_departure.month,
        "scheduled_is_peak_hour": 1 if 7 <= flight.scheduled_departure.hour <= 9 or 17 <= flight.scheduled_departure.hour <= 19 else 0,
        "scheduled_early_morning_departure": 1 if 0 <= flight.scheduled_departure.hour <= 6 else 0,
        "scheduled_late_night_departure": 1 if 22 <= flight.scheduled_departure.hour <= 23 else 0,
        "dep_date_only": dep_dt.day,
        "is_sri_lankan_public_holiday": holiday.get("is_sri_lankan_public_holiday", 0),
        "is_poya_day": holiday.get("is_poya_day", 0),
        "is_festival_period": holiday.get("is_festival_period", 0),
        "is_post_holiday": holiday.get("is_post_holiday", 0),
        "is_long_weekend": holiday.get("is_long_weekend", 0),
        "delay_ratio": getattr(flight, "delay_ratio", 0),
        "binary_delay_dep": getattr(flight, "binary_delay_dep", 0),
        "binary_delay_arr": getattr(flight, "binary_delay_arr", 0),
        "delay_class_dep": getattr(flight, "delay_class_dep", 0),
        "delay_class_arr": getattr(flight, "delay_class_arr", 0),
    }

    # 🔹 Combine all features
    model_features = {**dep_weather, **arr_weather, **time_features, **additional_features}

    # 🔹 Feature order must exactly match your model
    model_columns = [
        "dep_has_rain","dep_has_thunderstorm","dep_low_visibility","dep_high_wind",
        "arr_has_rain","arr_has_thunderstorm","arr_low_visibility","dep_is_monsoon_season",
        "scheduled_flight_duration_min","route_avg_delay","route_delay_rate",
        "airline_avg_delay","airline_delay_rate","aircraft_avg_delay","is_short_haul",
        "scheduled_departure_hour","scheduled_arrival_hour","scheduled_departure_day_of_week",
        "scheduled_arrival_day_of_week","scheduled_is_weekend","scheduled_month","scheduled_is_peak_hour",
        "scheduled_early_morning_departure","scheduled_late_night_departure","dep_date_only",
        "is_sri_lankan_public_holiday","is_poya_day","is_festival_period","is_post_holiday",
        "is_long_weekend","delay_ratio","binary_delay_dep","binary_delay_arr",
        "delay_class_dep","delay_class_arr","feature36","feature37","feature38","feature39","feature40"
    ]

    X = [model_features.get(col, 0) for col in model_columns]

    # 🔹 Predict delay
    result = predict(dict(zip(model_columns, X)))  # predict expects dict

    # 🔹 Save prediction
    input_snapshot = {
        "flight_number": flight.flight_number,
        "airline": flight.airline,
        "origin": flight.departure_airport,
        "destination": flight.arrival_airport,
        "aircraft": flight.aircraft,
        "scheduled_departure": dep_dt.isoformat(),
        "scheduled_arrival": flight.scheduled_arrival.isoformat(),
        **model_features,
    }

    prediction = Prediction(
        flight_id=flight.id,
        dep_delay_class=result["dep_delay_class"],
        dep_probability=result["dep_probability"],
        arr_delay_class=result["arr_delay_class"],
        arr_probability=result["arr_probability"],
        predicted_dep_delay_min=result.get("predicted_dep_delay_min"),
        predicted_arr_delay_min=result.get("predicted_arr_delay_min"),
        input_features=input_snapshot,
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return result

# Submit a prediction
# @router.post("/", response_model=PredictionOut)
# def submit_prediction(pred_in: PredictionCreate, db: Session = Depends(get_db)):
#     return add_prediction(db, pred_in)

# # Get all predictions for a flight
# @router.get("/flight/{flight_id}", response_model=list[PredictionOut])
# def predictions_for_flight(flight_id: int, db: Session = Depends(get_db)):
#     return get_predictions_by_flight(db, flight_id)

# # Get latest prediction for a flight
# @router.get("/flight/{flight_id}/latest", response_model=PredictionOut)
# def latest_prediction(flight_id: int, db: Session = Depends(get_db)):
#     pred = get_latest_prediction(db, flight_id)
#     if not pred:
#         raise HTTPException(status_code=404, detail="No prediction found for this flight")
#     return pred

# # Delete a prediction (optional, admin)
# @router.delete("/{prediction_id}", response_model=PredictionOut)
# def remove_prediction(prediction_id: int, db: Session = Depends(get_db)):
#     pred = delete_prediction(db, prediction_id)
#     if not pred:
#         raise HTTPException(status_code=404, detail="Prediction not found")
#     return pred
