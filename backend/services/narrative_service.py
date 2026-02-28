from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from services.llm_provider import get_llm
from typing import Dict, Any
import json
import re

NARRATIVE_PROMPT = ChatPromptTemplate.from_template("""
You are an aviation operations analyst. Generate a concise, professional operational narrative
based ONLY on the structured facts below. Do not speculate or invent information.

FLIGHT FACTS:
- Route: {origin_code} to {destination_code}
- Airline: {airline}
- Aircraft: {aircraft_type}
- Departure Delay Probability: {dep_probability} percent ({delay_class_dep})
- Scheduled Duration: {scheduled_flight_duration_min} minutes
- Is Short Haul: {is_short_haul}

WEATHER CONDITIONS:
- Departure Wind :{dep_wind_speed_10m}
- Departure Cloud Cover: {dep_cloud_cover}
- Departure Visibility: {dep_visibility}
- Departure Precipitation: {dep_precipitation}
- Departure Weather Code: {dep_weather_code}
- Arrival Wind :{arr_wind_speed_10m}
- Arrival Cloud Cover: {arr_cloud_cover}
- Arrival Visibility: {arr_visibility}
- Arrival Precipitation: {arr_precipitation}
- Arrival Weather Code: {arr_weather_code}
- Monsoon Season: {dep_is_monsoon_season}

SCHEDULE AND TIME:
- Departure Hour: {scheduled_departure_hour}
- Day of Week: {day_of_week}
- Is Weekend: {scheduled_is_weekend}
- Is Peak Hour: {scheduled_is_peak_hour}
- Late Night Departure: {scheduled_late_night_departure}
- Early Morning Departure: {scheduled_early_morning_departure}

HOLIDAY AND CONGESTION:
- Public Holiday: {is_sri_lankan_public_holiday}
- Poya Day: {is_poya_day}
- Festival Period: {is_festival_period}
- Post Holiday: {is_post_holiday}
- Long Weekend: {is_long_weekend}

HISTORICAL PERFORMANCE:
- Route Average Delay minutes: {route_avg_delay}
- Route Delay Rate: {route_delay_rate} percent
- Airline Average Delay minutes: {airline_avg_delay}
- Airline Delay Rate: {airline_delay_rate} percent
- Aircraft Average Delay minutes: {aircraft_avg_delay}

Respond with ONLY a valid JSON object, no markdown, no extra text:

{{
  "narrative": "2 to 3 sentence operational story explaining the delay situation based only on facts above",
  "reason_breakdown": {{
    "weather": "one sentence about weather contribution or write No significant weather impact",
    "holiday_congestion": "one sentence about holiday or congestion contribution or write No holiday impact",
    "route_history": "one sentence about route historical performance",
    "schedule": "one sentence about time of day and schedule factors"
  }},
  "confidence_explanation": "one sentence explaining what the probability means in plain language",
  "passenger_impact": "one sentence on who is most impacted by this delay"
}}
""")


def generate_narrative(
    features: Dict[str, Any],
    dep_probability: float,
    delay_class_dep: str,
) -> Dict[str, Any]:
    """
    Generates AI operational narrative using whichever LLM is configured.
    Switch via LLM_PROVIDER in .env: 1=Ollama, 2=Groq
    """
    day_labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    dow = features.get("scheduled_departure_day_of_week", 0)
    day_of_week = day_labels[int(dow) % 7] if isinstance(dow, (int, float)) else str(dow)

    prompt_vars = {
        "origin_code": features.get("origin_code", "N/A"),
        "destination_code": features.get("destination_code", "N/A"),
        "airline": features.get("airline", "N/A"),
        "aircraft_type": features.get("aircraft_type", "N/A"),
        "dep_probability": f"{dep_probability * 100:.0f}",
        "delay_class_dep": delay_class_dep,
        "scheduled_flight_duration_min": features.get("scheduled_flight_duration_min", 0),
        "is_short_haul": features.get("is_short_haul", False),
        "dep_wind_speed_10m": features.get("dep_wind_speed_10m", False),
        "dep_cloud_cover": features.get("dep_cloud_cover", False),
        "dep_visibility": features.get("dep_visibility", False),
        "dep_precipitation": features.get("dep_precipitation", False),
        "dep_weather_code": features.get("dep_weather_code", False),
        "arr_wind_speed_10m": features.get("arr_wind_speed_10m", False),
        "arr_cloud_cover": features.get("arr_cloud_cover", False),
        "arr_visibility": features.get("arr_visibility", False),
        "arr_precipitation": features.get("arr_precipitation", False),
        "arr_weather_code": features.get("arr_weather_code", False),
        "dep_is_monsoon_season": features.get("dep_is_monsoon_season", False),
        "scheduled_departure_hour": features.get("scheduled_departure_hour", 0),
        "day_of_week": day_of_week,
        "scheduled_is_weekend": features.get("scheduled_is_weekend", False),
        "scheduled_is_peak_hour": features.get("scheduled_is_peak_hour", False),
        "scheduled_late_night_departure": features.get("scheduled_late_night_departure", False),
        "scheduled_early_morning_departure": features.get("scheduled_early_morning_departure", False),
        "is_sri_lankan_public_holiday": features.get("is_sri_lankan_public_holiday", False),
        "is_poya_day": features.get("is_poya_day", False),
        "is_festival_period": features.get("is_festival_period", False),
        "is_post_holiday": features.get("is_post_holiday", False),
        "is_long_weekend": features.get("is_long_weekend", False),
        "route_avg_delay": round(features.get("route_avg_delay", 0), 1),
        "route_delay_rate": f"{features.get('route_delay_rate', 0) * 100:.0f}",
        "airline_avg_delay": round(features.get("airline_avg_delay", 0), 1),
        "airline_delay_rate": f"{features.get('airline_delay_rate', 0) * 100:.0f}",
        "aircraft_avg_delay": round(features.get("aircraft_avg_delay", 0), 1),
    }

    llm = get_llm()
    chain = NARRATIVE_PROMPT | llm | StrOutputParser()
    raw = chain.invoke(prompt_vars)

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
        return {
            "narrative": raw.strip(),
            "reason_breakdown": {
                "weather": "Unable to parse structured response.",
                "holiday_congestion": "",
                "route_history": "",
                "schedule": ""
            },
            "confidence_explanation": "",
            "passenger_impact": ""
        }