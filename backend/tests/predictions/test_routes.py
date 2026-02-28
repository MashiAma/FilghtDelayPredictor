# tests/test_prediction_routes.py
import pytest
from datetime import datetime, date, time
from models_sql.flight import Flight
from services.prediction_service import save_prediction

def mock_get_weather_features(airport_code, dep_dt, prefix):
    return {
        f"{prefix}_has_rain": 0,
        f"{prefix}_has_thunderstorm": 0,
        f"{prefix}_low_visibility": 0,
        f"{prefix}_high_wind": 0,
    }

def mock_get_holiday_features(db, dep_date):
    return {
        "is_sri_lankan_public_holiday": 0,
        "is_poya_day": 0,
        "is_festival_period": 0,
        "is_post_holiday": 0,
        "is_long_weekend": 0,
    }

def mock_build_time_features(dep_dt, arr_dt, status):
    return {
        "scheduled_departure_hour": dep_dt.hour,
        "scheduled_arrival_hour": arr_dt.hour,
        "scheduled_flight_duration_min": int((arr_dt - dep_dt).total_seconds() / 60),
        "scheduled_is_weekend": 0,
    }

def mock_get_historical_features(db, airline, aircraft, destination):
    return {
        "airline_avg_delay": 0,
        "airline_delay_rate": 0,
        "aircraft_avg_delay": 0,
        "route_avg_delay": 0,
        "route_delay_rate": 0,
        "is_short_haul": 1,
    }

def mock_save_prediction(features):
    return {
        "dep_probability": 0.2,
        "delay_class_dep": "On-time",
    }