import requests
from datetime import datetime, timezone

AIRPORT_COORDS = {
    "CMB": (7.1801543,79.8816746),
    "BOM": (19.0955, 72.8452),
    "DEL": (28.5570, 77.0795),
    "BLR": (13.1999, 77.7081),
    "MAA": (12.9919, 80.1340),
    "HYD": (17.2333, 78.4245),
    "KHI": (24.9008, 67.1655),
    "LHE": (31.5203, 74.4032),
    "DAC": (23.8434, 90.4004),
    "KTM": (27.6992, 85.3541),
    "MLE": (4.1888, 73.5248),
    # "PBH": (27.4052, 89.4162)
}

# LOW_VISIBILITY_THRESHOLD_M = 3000
# HIGH_WIND_THRESHOLD_MS = 15
# THUNDER_CODES = {95, 96, 99}

def get_weather_features(airport_code: str, dep_dt: datetime,prefix: str) -> dict:
    if airport_code not in AIRPORT_COORDS:
        raise ValueError(f"Unsupported airport code: {airport_code}")

    lat, lon = AIRPORT_COORDS[airport_code]

    url = (
        "https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        "&hourly=precipitation,weathercode,visibility,windspeed_10m,cloudcover"
        "&timezone=UTC"
    )

    res = requests.get(url, timeout=10)
    res.raise_for_status()
    data = res.json()

    hourly = data["hourly"]

    dep_dt_utc = dep_dt.astimezone(timezone.utc)
    dep_hour = dep_dt_utc.replace(minute=0, second=0, microsecond=0)
    dep_hour_str = dep_hour.isoformat(timespec="hours")

    try:
        idx = hourly["time"].index(dep_hour_str)
    except ValueError:
        idx = min(
            range(len(hourly["time"])),
            key=lambda i: abs(
                datetime.fromisoformat(hourly["time"][i]).timestamp()
                - dep_dt_utc.timestamp()
            )
        )

    wind_speed_10m = hourly["windspeed_10m"][idx]
    cloud_cover = hourly["cloudcover"][idx]
    visibility = hourly["visibility"][idx]
    precipitation = hourly["precipitation"][idx]
    weather_code = hourly["weathercode"][idx]
    

    return {
        f"{prefix}_wind_speed_10m": float(wind_speed_10m),
        f"{prefix}_cloud_cover": int(cloud_cover),
        f"{prefix}_visibility": int(visibility),
        f"{prefix}_precipitation": float(precipitation), 
        f"{prefix}_weather_code": int(weather_code), 
    }
