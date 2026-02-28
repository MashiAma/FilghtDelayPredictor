from services.prediction_service import save_prediction
from typing import Dict, Any, Optional
import copy

DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


def run_counterfactual(
    baseline_features: Dict[str, Any],
    new_departure_hour: Optional[int] = None,
    new_departure_day_offset: Optional[int] = None,
    new_airline: Optional[str] = None,
    new_route: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Compares baseline prediction vs modified counterfactual prediction.
    Reuses existing save_prediction() — same model, same pipeline.
    Only changes what you specify — everything else stays identical.
    """

    # ── Baseline ───────────────────────────────────────────────────────────────
    baseline_result = save_prediction(baseline_features)
    baseline_prob   = baseline_result["dep_probability"]

    # ── Build counterfactual features ──────────────────────────────────────────
    cf_features    = copy.deepcopy(baseline_features)
    changes_applied = {}

    if new_departure_hour is not None:
        original_hour = cf_features.get("scheduled_departure_hour", 0)
        original_min  = cf_features.get("scheduled_depature_time", 0) % 60
        cf_features["scheduled_depature_time"]         = new_departure_hour * 60 + original_min
        cf_features["scheduled_departure_hour"]        = new_departure_hour
        cf_features["scheduled_is_peak_hour"]          = 1 if (7 <= new_departure_hour <= 9 or 17 <= new_departure_hour <= 19) else 0
        cf_features["scheduled_early_morning_departure"] = 1 if new_departure_hour < 6 else 0
        cf_features["scheduled_late_night_departure"]  = 1 if new_departure_hour >= 22 else 0
        changes_applied["departure_hour"] = {"from": original_hour, "to": new_departure_hour}

    if new_departure_day_offset is not None:
        original_dow = int(cf_features.get("scheduled_departure_day_of_week", 0))
        new_dow      = (original_dow + new_departure_day_offset) % 7
        cf_features["scheduled_departure_day_of_week"] = new_dow
        cf_features["scheduled_is_weekend"]            = 1 if new_dow >= 5 else 0
        changes_applied["day_offset"] = {
            "from_dow": original_dow,
            "to_dow": new_dow,
            "offset_days": new_departure_day_offset
        }

    if new_airline is not None:
        changes_applied["airline"] = {
            "from": cf_features.get("airline"),
            "to": new_airline
        }
        cf_features["airline"] = new_airline

    if new_route is not None:
        parts = new_route.split("_")
        if len(parts) == 2:
            cf_features["origin_code"]      = parts[0]
            cf_features["destination_code"] = parts[1]
            cf_features["route"]            = new_route
            changes_applied["route"]        = {"to": new_route}

    # ── Counterfactual prediction ──────────────────────────────────────────────
    try:
        cf_result = save_prediction(cf_features)
        cf_prob   = cf_result["dep_probability"]
    except ValueError as e:
        return {
            "error": str(e),
            "baseline_delay_probability": round(baseline_prob, 4),
            "counterfactual_delay_probability": None,
            "risk_change": None,
            "risk_change_pct": None,
            "interpretation": "Counterfactual failed due to unseen category.",
            "recommendation": "Try different parameters.",
            "changes_applied": changes_applied,
            "baseline_class": baseline_result["delay_class_dep"],
            "counterfactual_class": None,
        }

    risk_change     = round(cf_prob - baseline_prob, 4)
    risk_change_pct = round((risk_change / baseline_prob) * 100, 1) if baseline_prob > 0 else 0
    direction       = "reduces" if risk_change < 0 else "increases"
    abs_pct         = abs(risk_change_pct)

    # ── Human-readable interpretation ─────────────────────────────────────────
    if not changes_applied:
        interpretation = "No changes were applied — result is identical to baseline."
    elif "departure_hour" in changes_applied:
        from_h = changes_applied["departure_hour"]["from"]
        to_h   = changes_applied["departure_hour"]["to"]
        interpretation = (
            f"Shifting departure from {from_h:02d}:00 to {to_h:02d}:00 "
            f"{direction} predicted delay risk by {abs_pct:.1f}%."
        )
    elif "airline" in changes_applied:
        interpretation = (
            f"Switching from {changes_applied['airline']['from']} to "
            f"{changes_applied['airline']['to']} {direction} predicted delay risk by {abs_pct:.1f}%."
        )
    elif "day_offset" in changes_applied:
        to_day = DAY_LABELS[changes_applied["day_offset"]["to_dow"]]
        interpretation = (
            f"Departing on a {to_day} instead {direction} predicted delay risk by {abs_pct:.1f}%."
        )
    else:
        interpretation = f"The proposed changes {direction} predicted delay risk by {abs_pct:.1f}%."

    recommendation = (
        "This change is beneficial — lower delay risk."
        if risk_change < -0.02
        else "This change worsens delay risk — not recommended."
        if risk_change > 0.02
        else "Minimal impact — this change has little effect on delay risk."
    )

    return {
        "baseline_delay_probability":        round(baseline_prob, 4),
        "counterfactual_delay_probability":  round(cf_prob, 4),
        "risk_change":                       risk_change,
        "risk_change_pct":                   risk_change_pct,
        "interpretation":                    interpretation,
        "recommendation":                    recommendation,
        "changes_applied":                   changes_applied,
        "baseline_class":                    baseline_result["delay_class_dep"],
        "counterfactual_class":              cf_result["delay_class_dep"],
    }