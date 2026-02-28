from typing import Dict, Any, List

IMPACT_RULES = [
    {
        "condition": lambda f: (
            f.get("scheduled_late_night_departure") and
            f.get("is_short_haul") and
            f.get("delay_class_arr") == "Major"
        ),
        "impact": "Short-haul passengers on late-night departures face the highest inconvenience — few or no rebooking options at this hour.",
        "severity": "critical"
    },
    {
        "condition": lambda f: (
            f.get("is_long_weekend") and
            f.get("delay_class_dep") in ["Minor", "Major"]
        ),
        "impact": "Long weekend travelers are disproportionately affected — high passenger volumes reduce rebooking flexibility.",
        "severity": "high"
    },
    {
        "condition": lambda f: (
            f.get("is_post_holiday") and
            float(f.get("route_delay_rate", 0)) > 0.4
        ),
        "impact": "Post-holiday congestion on this route suggests returning travelers will experience above-average delays.",
        "severity": "medium"
    },
    {
        "condition": lambda f: (
            f.get("scheduled_early_morning_departure") and
            f.get("dep_has_thunderstorm")
        ),
        "impact": "Early morning thunderstorm conditions create cascading delays affecting the full day schedule.",
        "severity": "high"
    },
    {
        "condition": lambda f: (
            f.get("dep_is_monsoon_season") and
            float(f.get("dep_probability", 0)) > 0.5
        ),
        "impact": "Monsoon season conditions disproportionately affect connecting flight passengers with tight layover windows.",
        "severity": "medium"
    },
    {
        "condition": lambda f: (
            f.get("is_poya_day") and
            f.get("delay_class_dep") in ["Minor", "Major"]
        ),
        "impact": "Poya day travel surge increases airport congestion, impacting leisure and religious travelers.",
        "severity": "medium"
    },
]

SEVERITY_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}
SEVERITY_SCORE = {"critical": 10, "high": 7, "medium": 4, "low": 2}


def analyze_passenger_impact(
    features: Dict[str, Any],
    dep_probability: float,
    delay_class_dep: str,
) -> Dict[str, Any]:
    """
    Determines which passenger segments are most impacted and why.
    Rule-based, deterministic — no LLM, no API cost.
    """
    enriched = {
        **features,
        "dep_probability": dep_probability,
        "delay_class_dep": delay_class_dep,
    }

    triggered = []
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
        triggered[0]["impact"] if triggered
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
    segments = []
    if features.get("is_short_haul"):
        segments.append("Short-haul passengers")
    if features.get("scheduled_late_night_departure"):
        segments.append("Late-night travelers")
    if features.get("is_long_weekend"):
        segments.append("Long weekend travelers")
    if features.get("is_festival_period"):
        segments.append("Festival travelers")
    if features.get("is_poya_day"):
        segments.append("Poya day travelers")
    if features.get("scheduled_is_weekend"):
        segments.append("Weekend leisure travelers")
    return segments if segments else ["General passengers"]