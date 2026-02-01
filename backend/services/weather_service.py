import requests
from datetime import datetime, timezone

# OPENWEATHER_KEY = "YOUR_API_KEY"

AIRPORT_COORDS = {
    "CMB": (6.9271, 79.8612),
    "BOM": (19.0896, 72.8656),
}

def get_weather_features(airport_code: str, dep_dt: datetime) -> dict:
    lat, lon = AIRPORT_COORDS[airport_code]

    url = (
        "https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        "&hourly=precipitation,weathercode,visibility,windspeed_10m"
        "&timezone=UTC"
    )

    res = requests.get(url, timeout=10)
    res.raise_for_status()
    data = res.json()

    hourly = data["hourly"]

    # Convert departure time to UTC ISO string hour
    dep_dt_utc = dep_dt.astimezone(timezone.utc)
    dep_hour = dep_dt_utc.replace(minute=0, second=0, microsecond=0)
    dep_hour_str = dep_hour.isoformat(timespec="hours")

    try:
        idx = hourly["time"].index(dep_hour_str)
    except ValueError:
        # fallback: nearest hour
        idx = min(
            range(len(hourly["time"])),
            key=lambda i: abs(
                datetime.fromisoformat(hourly["time"][i]).timestamp()
                - dep_dt_utc.timestamp()
            )
        )

    precipitation = hourly["precipitation"][idx]
    weathercode = hourly["weathercode"][idx]
    visibility = hourly["visibility"][idx]
    windspeed = hourly["windspeed_10m"][idx]

    return {
        "has_rain": int(precipitation > 0),
        "has_thunderstorm": int(weathercode in [95, 96, 99]),
        "low_visibility": int(visibility < 3000),
        "high_wind": int(windspeed > 10),
    }