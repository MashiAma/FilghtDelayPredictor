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

        cf_features["scheduled_departure_hour"] = new_departure_hour
        cf_features["scheduled_is_peak_hour"] = 1 if (
            6 <= new_departure_hour <= 9 or 18 <= new_departure_hour <= 21
        ) else 0

        cf_features["scheduled_early_morning_departure"] = 1 if new_departure_hour < 6 else 0
        cf_features["scheduled_late_night_departure"] = 1 if new_departure_hour >= 22 else 0

        changes_applied["departure_hour"] = {
            "from": original_hour,
            "to": new_departure_hour
        }

    # ─────────────────────────────────────────
    # Day shift change
    # ─────────────────────────────────────────
    if new_departure_day_offset is not None:

        original_dow = int(cf_features.get("scheduled_departure_day_of_week", 0))
        new_dow = (original_dow + new_departure_day_offset) % 7

        cf_features["scheduled_departure_day_of_week"] = new_dow
        cf_features["scheduled_is_weekend"] = 1 if new_dow >= 5 else 0

        changes_applied["day_offset"] = {
            "from_day": DAY_LABELS[original_dow],
            "to_day": DAY_LABELS[new_dow],
            "offset_days": new_departure_day_offset
        }

    if new_airline is not None:

        original_airline = cf_features.get("airline")

        cf_features["airline"] = new_airline

        changes_applied["airline"] = {
            "from": original_airline,
            "to": new_airline
        }

    # ─────────────────────────────────────────
    # Route change
    # ─────────────────────────────────────────
    if new_route is not None:

        parts = new_route.split("_")

        if len(parts) == 2:

            cf_features["origin_code"] = parts[0]
            cf_features["destination_code"] = parts[1]
            cf_features["route"] = new_route

            changes_applied["route"] = {
                "from": baseline_features.get("route"),
                "to": new_route
            }

    # ─────────────────────────────────────────
    # Counterfactual prediction
    try:

        cf_result = save_prediction(cf_features)
        cf_prob = cf_result["dep_probability"]

    except ValueError as e:

        return {
            "error": str(e),
            "baseline_delay_probability": round(baseline_prob,4),
            "counterfactual_delay_probability": None,
            "interpretation": "Counterfactual scenario could not be evaluated.",
            "recommendation": "The modified input contains unseen categories.",
            "changes_applied": changes_applied
        }

    # ─────────────────────────────────────────
    # Risk comparison
    risk_change = round(cf_prob - baseline_prob,4)

    risk_change_pct = (
        round((risk_change / baseline_prob) * 100,1)
        if baseline_prob > 0
        else 0
    )

    direction = "reduces" if risk_change < 0 else "increases"
    abs_pct = abs(risk_change_pct)

    # ─────────────────────────────────────────
    # Human readable explanation
    # ─────────────────────────────────────────
    explanation_parts = []

    if "departure_hour" in changes_applied:

        c = changes_applied["departure_hour"]

        explanation_parts.append(
            f"Changing departure time from {c['from']:02d}:00 to {c['to']:02d}:00"
        )

    if "day_offset" in changes_applied:

        c = changes_applied["day_offset"]

        explanation_parts.append(
            f"shifting the flight from {c['from_day']} to {c['to_day']}"
        )

    if "airline" in changes_applied:

        c = changes_applied["airline"]

        explanation_parts.append(
            f"switching airline from {c['from']} to {c['to']}"
        )

    if "route" in changes_applied:

        c = changes_applied["route"]

        explanation_parts.append(
            f"changing route from {c['from']} to {c['to']}"
        )

    if explanation_parts:

        explanation = ", ".join(explanation_parts)

        interpretation = (
            f"{explanation} {direction} the predicted delay probability "
            f"by approximately {abs_pct:.1f}%."
        )

    else:

        interpretation = "No changes were applied. Counterfactual equals baseline."

    # ─────────────────────────────────────────
    # Recommendation logic
    # ─────────────────────────────────────────
    if risk_change < -0.05:

        recommendation = "Recommended adjustment — this configuration significantly reduces delay risk."

    elif risk_change < -0.01:

        recommendation = "Slight improvement — this adjustment moderately lowers delay risk."

    elif risk_change > 0.05:

        recommendation = "Not recommended — this change substantially increases delay risk."

    elif risk_change > 0.01:

        recommendation = "Minor negative impact — this configuration slightly increases delay risk."

    else:

        recommendation = "Minimal impact — the modification has negligible effect on delay probability."

    # ─────────────────────────────────────────
    # Final response
    # ─────────────────────────────────────────
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