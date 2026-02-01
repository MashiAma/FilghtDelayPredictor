from datetime import datetime

def build_time_features(dep_dt: datetime, arr_dt: datetime) -> dict:
    duration_min = int((arr_dt - dep_dt).total_seconds() / 60)

    return {
        "scheduled_departure_hour": dep_dt.hour,
        "scheduled_arrival_hour": arr_dt.hour,
        "scheduled_departure_day_of_week": dep_dt.weekday(),
        "scheduled_arrival_day_of_week": arr_dt.weekday(),
        "scheduled_is_weekend": int(dep_dt.weekday() >= 5),
        "scheduled_month": dep_dt.month,
        "scheduled_flight_duration_min": duration_min,
        "scheduled_is_peak_hour": int(dep_dt.hour in [7,8,9,17,18,19]),
        "scheduled_early_morning_departure": int(dep_dt.hour < 6),
        "scheduled_late_night_departure": int(dep_dt.hour >= 22),
    }
