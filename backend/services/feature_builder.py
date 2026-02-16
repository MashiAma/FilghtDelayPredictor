from datetime import datetime
from sqlalchemy.orm import Session
from models_sql.airline import Airline
from models_sql.aircraft import Aircraft
from models_sql.route import Route

def build_time_features(dep_dt: datetime, arr_dt: datetime, status:str) -> dict:
    duration_min = int((arr_dt - dep_dt).total_seconds() / 60)

    status_clean = (status or "").strip().lower()
    weekday_map = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    return {
        "scheduled_departure_hour": dep_dt.hour,
        "scheduled_arrival_hour": arr_dt.hour,
        "scheduled_departure_day_of_week": weekday_map[dep_dt.weekday()],
        "scheduled_arrival_day_of_week": weekday_map[arr_dt.weekday()],
        "scheduled_is_weekend": 1 if (int(dep_dt.weekday())) >= 5 else 0,
        "scheduled_month": dep_dt.month,
        "scheduled_is_peak_hour": 1 if 6 <= (int(dep_dt.hour)) <= 10 or 16 <= (int(dep_dt.hour)) <= 20 else 0,
        "scheduled_early_morning_departure": 1 if 0 <=  (int(dep_dt.hour)) <= 6 else 0,
        "scheduled_late_night_departure": 1 if 22 <=(int(dep_dt.hour)) <= 24 else 0,
        "scheduled_flight_duration_min": duration_min,

        "is_diverted": int(status_clean == "diverted"),
        "is_cancelled": int(status_clean == "cancelled"),
        "dep_is_monsoon_season": 1 if dep_dt.month in [5,6,7,8,9] else 0,
    }

def get_historical_features(
    db: Session,
    airline: str,
    aircraft: str,
    destination: str
) -> dict:
    # Airline features
    airline_row = db.query(Airline).filter(Airline.airline == airline).first()
    airline_avg_delay = airline_row.avg_delay if airline_row else 0
    airline_delay_rate = airline_row.delay_rate if airline_row else 0

    # Aircraft features
    aircraft_row = db.query(Aircraft).filter(Aircraft.aircraft == aircraft).first()
    aircraft_avg_delay = aircraft_row.avg_delay if aircraft_row else 0

    # Route features
    route_row = db.query(Route).filter(
        Route.destination == destination
    ).first()
    route_avg_delay = route_row.avg_delay if route_row else 0
    route_delay_rate = route_row.delay_rate if route_row else 0
    is_short_haul = route_row.is_short_haul if route_row else 0

    return {
        "is_short_haul": is_short_haul,
        "route_avg_delay": route_avg_delay,
        "route_delay_rate": route_delay_rate, 
        "airline_avg_delay": airline_avg_delay,
        "airline_delay_rate": airline_delay_rate,
        "aircraft_avg_delay": aircraft_avg_delay,
    }
