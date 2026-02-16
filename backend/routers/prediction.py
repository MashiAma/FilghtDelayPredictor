from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models_sql.flight import Flight
from models_sql.prediction import Prediction
from database.connection import get_db
from datetime import datetime, date, time
# from services.prediction_service import (
#     # get_predictions_by_flight,
#     # get_latest_prediction,
#     # delete_prediction
# )
from schemas.prediction import PredictionRequest
# PredictionCreate, PredictionOut
from services.weather_service import get_weather_features
from services.holiday_service import get_holiday_features
from services.feature_builder import build_time_features, get_historical_features
from services.prediction_service import save_prediction
import calendar

router = APIRouter()

def combine_date_time(d: datetime.date, t: datetime.time) -> datetime:
    """Combine date and time into a single datetime object."""
    return datetime.combine(d, t)

@router.post("/predict")
def predict_and_save(payload: PredictionRequest, db: Session = Depends(get_db)):
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
    scheduled_dep_time = (
        flight.scheduled_departure.hour * 60
        + flight.scheduled_departure.minute
    )

    scheduled_arr_time = (
        flight.scheduled_arrival.hour * 60
        + flight.scheduled_arrival.minute
    )
    scheduled_duration = int(
        (flight.scheduled_arrival - flight.scheduled_departure)
        .total_seconds() / 60
    )
    base_features = {
        "id": flight.id,
        "airline": flight.airline,
        "origin_code": flight.departure_airport,
        "destination_code": flight.arrival_airport,
        "route": f"{flight.departure_airport}_{flight.arrival_airport}",
        "aircraft_type": flight.aircraft,
        "scheduled_depature_time": scheduled_dep_time,
        "scheduled_arrival_time": scheduled_arr_time,
        "scheduled_flight_duration_min": scheduled_duration,
    }
    dep_weather = get_weather_features(flight.departure_airport, dep_dt,prefix="dep")
    arr_weather = get_weather_features(flight.arrival_airport, flight.scheduled_arrival,prefix="arr")
    holiday_features = get_holiday_features(db, dep_dt.date())
    time_features = build_time_features(dep_dt, flight.scheduled_arrival, flight.status)
    historical_features = get_historical_features(
        db=db,
        airline=flight.airline,
        aircraft=flight.aircraft,
        destination=flight.arrival_airport
    )
    hour = flight.scheduled_departure.hour


    # Combine all features
    model_features = {**base_features,**dep_weather, **arr_weather, **holiday_features, **time_features, **historical_features}

    # Model columns in correct order
    # model_columns = [
    #     # Departure weather
    #     "id","airline","origin_code","destination_code","route",
    #     "aircraft_type","scheduled_depature_time","actual_depature_time",
    #     "scheduled_arrival_time","actual_arrival_time","departure_delay_min",
    #     "arrival_delay_min","is_diverted","is_cancelled","dep_has_rain","dep_has_thunderstorm","dep_low_visibility","dep_high_wind","arr_has_rain","arr_has_thunderstorm","arr_low_visibility","dep_is_monsoon_season",
    #     "dep_date_only","is_sri_lankan_public_holiday","is_poya_day","is_festival_period","is_post_holiday","is_long_weekend","scheduled_departure_hour","scheduled_arrival_hour",
    #     "scheduled_departure_day_of_week","scheduled_arrival_day_of_week","scheduled_is_weekend","scheduled_month","scheduled_is_peak_hour","scheduled_early_morning_departure",
    #     "scheduled_late_night_departure","scheduled_flight_duration_min","delay_ratio","is_short_haul","route_avg_delay","route_delay_rate","airline_avg_delay","airline_delay_rate",
    #     "aircraft_avg_delay","binary_delay_dep","binary_delay_arr","delay_class_dep","delay_class_arr"
    # ]

    # X = [model_features.get(col, 0) for col in model_columns]
    # print("Values",X)

    # Predict delay
    # result = predict(dict(zip(model_columns, X)))  # predict expects dict

    try:
        result = save_prediction(model_features)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    prediction = Prediction(
        flight_id=flight.id,
        user_email=payload.user_email,
        delay_class_dep=result["delay_class_dep"],
        dep_probability=float(result.get("dep_probability", 0)),
        delay_class_arr=result.get("delay_class_arr"),
        arr_probability=float(result.get("arr_probability", 0)),
        predicted_dep_delay_min=result.get("predicted_dep_delay_min"),
        predicted_arr_delay_min=result.get("predicted_arr_delay_min"),
        input_features=model_features,
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return result


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


# Admin Dashboard
# get admin dashboard stats

