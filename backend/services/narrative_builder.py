def build_structured_facts(result, model_features):
    return {
        "delay_probability": result["dep_probability"],
        "risk_level": result["delay_class_dep"],
        "route_avg_delay": model_features.get("route_avg_delay"),
        "is_long_weekend": model_features.get("is_long_weekend"),
        "is_short_haul": model_features.get("is_short_haul"),
        "weather_flags": {
            "dep_wind_speed_10m": features.get("dep_wind_speed_10m", False),
            "dep_cloud_cover": features.get("dep_cloud_cover", False),
            "dep_visibility": features.get("dep_visibility", False),
            "dep_precipitation": features.get("dep_precipitation", False),
            "dep_weather_code": features.get("dep_weather_code", False),
        },
        "top_factors": result["dep_top_features"],
    }