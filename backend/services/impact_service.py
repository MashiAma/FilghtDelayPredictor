from typing import Dict, Any, List

IMPACT_RULES = [
    {
        "condition": lambda f: (
            bool(f.get("scheduled_late_night_departure")) and
            bool(f.get("is_short_haul")) and
            f.get("delay_class_dep") == "Delayed"
        ),
        "impact": "Short-haul passengers on late-night departures face the highest inconvenience due to limited rebooking options at night.",
        "severity": "critical"
    },
    {
        "condition": lambda f: (
            bool(f.get("is_long_weekend")) and
            f.get("delay_class_dep") == "Delayed"
        ),
        "impact": "Long-weekend travelers experience greater disruption because peak travel demand reduces seat availability for rebooking.",
        "severity": "high"
    },
    {
        "condition": lambda f: (
            bool(f.get("is_post_holiday")) and
            float(f.get("route_delay_rate", 0)) > 0.4
        ),
        "impact": "Post-holiday return travel combined with historically high route delay rates increases disruption risk for passengers.",
        "severity": "medium"
    },
    {
        "condition": lambda f: (
            bool(f.get("scheduled_early_morning_departure")) and
            float(f.get("dep_precipitation", 0)) > 0
        ),
        "impact": "Early-morning precipitation can trigger operational delays that cascade through the rest of the day's flight schedule.",
        "severity": "high"
    },
    {
        "condition": lambda f: (
            bool(f.get("dep_is_monsoon_season")) and
            float(f.get("dep_probability", 0)) > 0.5
        ),
        "impact": "Monsoon season conditions significantly increase disruption risk, particularly for passengers with connecting flights.",
        "severity": "medium"
    },
]

SEVERITY_ORDER = {
    "critical": 0,
    "high": 1,
    "medium": 2,
    "low": 3
}

SEVERITY_SCORE = {
    "critical": 10,
    "high": 7,
    "medium": 4,
    "low": 2
}


def analyze_passenger_impact(
    features: Dict[str, Any],
    dep_probability: float,
    delay_class_dep: str,
) -> Dict[str, Any]:
    """
    Evaluates which passenger groups are most affected by a predicted delay.

    Uses deterministic rule-based logic (no LLM) to identify
    passenger segments likely to experience greater inconvenience.
    """

    enriched = {
        **features,
        "dep_probability": dep_probability,
        "delay_class_dep": delay_class_dep,
    }

    triggered: List[Dict[str, str]] = []

    for rule in IMPACT_RULES:
        try:
            if rule["condition"](enriched):
                triggered.append({
                    "impact": rule["impact"],
                    "severity": rule["severity"]
                })
        except Exception:
            continue

    triggered.sort(key=lambda x: SEVERITY_ORDER.get(x["severity"], 99))

    score = max(
        [SEVERITY_SCORE.get(t["severity"], 0) for t in triggered],
        default=2
    )

    primary = (
        triggered[0]["impact"]
        if triggered
        else "No specific passenger group is disproportionately impacted by this delay."
    )

    return {
        "primary_impact": primary,
        "all_impacts": triggered,
        "inconvenience_score": score,
        "inconvenience_label": (
            "Critical" if score >= 9
            else "High" if score >= 6
            else "Medium" if score >= 3
            else "Low"
        ),
        "affected_segments": _get_affected_segments(enriched)
    }


def _get_affected_segments(features: Dict[str, Any]) -> List[str]:
    """
    Identifies passenger segments affected based on contextual features.
    """

    segments: List[str] = []

    if features.get("is_short_haul"):
        segments.append("Short-Haul Passengers")

    if features.get("scheduled_early_morning_departure"):
        segments.append("Early-Morning Travelers")

    if features.get("scheduled_late_night_departure"):
        segments.append("Late-Night Travelers")

    if features.get("is_long_weekend"):
        segments.append("Long-Weekend Travelers")

    if features.get("is_festival_period"):
        segments.append("Festival Travelers")

    if features.get("scheduled_is_weekend"):
        segments.append("Weekend Leisure Travelers")

    return segments if segments else ["General Passengers"]