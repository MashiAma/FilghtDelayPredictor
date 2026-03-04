from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from models_sql.flight import Flight
from models_sql.user import User
from models_sql.prediction import Prediction
from database.connection import get_db
from datetime import datetime, date, time
# from services.prediction_service import (
#     # get_predictions_by_flight,
#     # get_latest_prediction,
#     # delete_prediction
# )
from schemas.prediction import PredictionRequest
from services.weather_service import get_weather_features
from services.holiday_service import get_holiday_features
from services.feature_builder import build_time_features, get_historical_features
from services.prediction_service import save_prediction
import calendar
# from services.narrative_builder import build_structured_facts
from services.narrative_service import generate_narrative
from services.impact_service import analyze_passenger_impact
from services.recommendation_service import build_recommendations
from services.counterfactual_service import run_counterfactual
from services.alert_service import trigger_delay_alert
from services.travel_insights_service import get_airport_risk_insight


router = APIRouter()

def combine_date_time(d: datetime.date, t: datetime.time) -> datetime:
    """Combine date and time into a single datetime object."""
    return datetime.combine(d, t)

@router.post("/predict")
def predict_and_save(payload: PredictionRequest, db: Session = Depends(get_db)):
    dep_dt = combine_date_time(payload.departure_date, payload.departure_time)

    # Find flight
    flight_q = db.query(Flight).filter(
        Flight.arrival_airport == payload.arrival_airport,
        Flight.scheduled_departure == dep_dt
    )
    if payload.flight_number:
        flight_q = flight_q.filter(Flight.flight_number == payload.flight_number)

    flight = flight_q.first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")

    # Gather features
    scheduled_dep_time = (
        flight.scheduled_departure.hour * 60
        + flight.scheduled_departure.minute
    )

    scheduled_arr_time = (
        flight.scheduled_arrival.hour * 60
        + flight.scheduled_arrival.minute
    )
    scheduled_duration = int(
        (flight.scheduled_arrival - flight.scheduled_departure)
        .total_seconds() / 60
    )
    base_features = {
        "id": flight.id,
        "airline": flight.airline,
        "origin_code": flight.departure_airport,
        "destination_code": flight.arrival_airport,
        "route": f"{flight.departure_airport}_{flight.arrival_airport}",
        "aircraft_type": flight.aircraft,
        "scheduled_departure_time": scheduled_dep_time,
        "scheduled_arrival_time": scheduled_arr_time,
        "scheduled_flight_duration_min": scheduled_duration,
    }
    dep_weather = get_weather_features(flight.departure_airport, dep_dt,prefix="dep")
    arr_weather = get_weather_features(flight.arrival_airport, flight.scheduled_arrival,prefix="arr")
    holiday_features = get_holiday_features(db, dep_dt.date())
    time_features = build_time_features(dep_dt, flight.scheduled_arrival, flight.status)
    historical_features = get_historical_features(
        db=db,
        airline=flight.airline,
        aircraft=flight.aircraft,
        destination=flight.arrival_airport
    )
    hour = flight.scheduled_departure.hour


    # Combine all features
    model_features = {**base_features,**dep_weather, **arr_weather, **holiday_features, **time_features, **historical_features}

    # Model columns in correct order
    # model_columns = [
    #     # Departure weather
    #     "id","airline","origin_code","destination_code","route",
    #     "aircraft_type","scheduled_depature_time","actual_depature_time",
    #     "scheduled_arrival_time","actual_arrival_time","departure_delay_min",
    #     "arrival_delay_min","is_diverted","is_cancelled","dep_has_rain","dep_has_thunderstorm","dep_low_visibility","dep_high_wind","arr_has_rain","arr_has_thunderstorm","arr_low_visibility","dep_is_monsoon_season",
    #     "dep_date_only","is_sri_lankan_public_holiday","is_poya_day","is_festival_period","is_post_holiday","is_long_weekend","scheduled_departure_hour","scheduled_arrival_hour",
    #     "scheduled_departure_day_of_week","scheduled_arrival_day_of_week","scheduled_is_weekend","scheduled_month","scheduled_is_peak_hour","scheduled_early_morning_departure",
    #     "scheduled_late_night_departure","scheduled_flight_duration_min","delay_ratio","is_short_haul","route_avg_delay","route_delay_rate","airline_avg_delay","airline_delay_rate",
    #     "aircraft_avg_delay","binary_delay_dep","binary_delay_arr","delay_class_dep","delay_class_arr"
    # ]

    # X = [model_features.get(col, 0) for col in model_columns]
    # print("Values",X)

    # Predict delay
    # result = predict(dict(zip(model_columns, X)))  # predict expects dict

    try:
        result = save_prediction(model_features)
        print("Top features contributing to the delay:")
        for f in result["dep_top_features"]:
            if isinstance(f, dict):
                print(f"Feature: {f['feature']}, Impact: {f['impact']:.4f}")
            else:
                print(f"Feature: {f[0]}, Impact: {float(f[1]):.4f}")
        # facts = build_structured_facts(result, model_features)
        # narrative = generate_narrative(facts)
        # result["narrative"] = narrative
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        print("FULL ERROR 1:", e)

    dep_probability = result["dep_probability"]
    delay_class_dep = result["delay_class_dep"]

    # Save prediction
    try:
        prediction = Prediction(
            flight_id=flight.id,
            user_email=payload.user_email,
            delay_class_dep=delay_class_dep,
            dep_probability=float(dep_probability),
            input_features=model_features,
        )
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
    except Exception as e:
        print("Prediction save failed:", e)
        raise HTTPException(status_code=500, detail="Could not save prediction")

    # Trigger alert
    try:
        trigger_delay_alert(
            db=db,
            user_email=payload.user_email,
            flight_id=flight.id,
            probability=dep_probability,
            delay_class=delay_class_dep,
        )
    except Exception as e:
        print("Alert trigger failed:", e)

    # Travel Insight response
    try:
        travel_insight = get_airport_risk_insight(db=db, airport_code=payload.arrival_airport)
    except Exception as e:
        print("Travel insight error:", e)
        travel_insight = None
    # try:
    #     print("######################################")
    #     print("airport", payload.arrival_airport)
    #     print("#################################((((((((((((((((((((((((((((((((((((((((((((((((#####")
    #     arrival_airport = 'MLE'
    #     travel_insight = get_airport_risk_insight(
    #         db=db,
    #         airport_code=payload.arrival_airport
    #     )
    #     print("HI : ", travel_insight)
    # except Exception as e:
    #     print("Travel insight error:", e)
    #     travel_insight = None
    #     print("FULL ERROR:", e)
        

    # AI Narrative
    narrative_result = {}
    try:
        narrative_result = generate_narrative(
            features=model_features,
            dep_probability=dep_probability,
            delay_class_dep=delay_class_dep,
            top_features=result["dep_top_features"],
        )
    except Exception as e:
        print(f"[NARRATIVE ERROR] {type(e).__name__}: {e}")
        narrative_result = {
            "narrative": f"Narrative generation unavailable: {str(e)}",
            "reason_breakdown": {},
            "confidence_explanation": "",
            # "top_features":""
        }

    # # Passenger Impact
    # impact_result = {}
    # try:
    #     impact_result = analyze_passenger_impact(
    #         features=model_features,
    #         dep_probability=dep_probability,
    #         delay_class_dep=delay_class_dep,
    #     )
    # except Exception:
    #     impact_result = {
    #         "primary_impact": "Impact analysis unavailable.",
    #         "all_impacts": [],
    #         "inconvenience_score": 0,
    #         "inconvenience_label": "Unknown",
    #         "affected_segments": []
    #     }

    # # Recommendation
    # recommendation_result = {}
    # try:
    #     recommendation_result = build_recommendations(
    #         db=db,
    #         origin=flight.departure_airport,
    #         destination=flight.arrival_airport,
    #         airline=flight.airline,
    #     )
    # except Exception:
    #     recommendation_result = {
    #         "best_departure_hour": None,
    #         "best_departure_label": "Unavailable",
    #         "best_day_of_week": "Unavailable",
    #         "best_airline": None,
    #         "time_slots": [],
    #         "summary": "Recommendation data unavailable."
    #     }

    # # Counterfactual (auto: tries 3 hours earlier as default what-if) ────
    # counterfactual_result = {}
    # try:
    #     original_hour = model_features.get("scheduled_departure_hour", 12)
    #     suggested_hour = max(0, original_hour - 3)  # suggest 3 hours earlier
    #     counterfactual_result = run_counterfactual(
    #         baseline_features=model_features,
    #         new_departure_hour=suggested_hour,
    #     )
    # except Exception:
    #     counterfactual_result = {
    #         "baseline_delay_probability": dep_probability,
    #         "counterfactual_delay_probability": None,
    #         "risk_change": None,
    #         "risk_change_pct": None,
    #         "interpretation": "Counterfactual simulation unavailable.",
    #         "recommendation": "",
    #         "changes_applied": {},
    #         "baseline_class": delay_class_dep,
    #         "counterfactual_class": None,
    #     }

    

    # Combined response
    return {
        # Original prediction

        # AI Narrative
        "narrative":              narrative_result.get("narrative", ""),
        "reason_breakdown":       narrative_result.get("reason_breakdown", {}),
        "confidence_explanation": narrative_result.get("confidence_explanation", ""),
        "top_features": narrative_result.get("top_features", ""),

        # # Passenger Impact
        # "passenger_impact":    impact_result.get("primary_impact", ""),
        # "all_impacts":         impact_result.get("all_impacts", []),
        # "inconvenience_score": impact_result.get("inconvenience_score", 0),
        # "inconvenience_label": impact_result.get("inconvenience_label", ""),
        # "affected_segments":   impact_result.get("affected_segments", []),

        # # Recommendation
        # "recommendation_summary":  recommendation_result.get("summary", ""),
        # "best_departure_hour":     recommendation_result.get("best_departure_hour"),
        # "best_departure_label":    recommendation_result.get("best_departure_label", ""),
        # "best_day_of_week":        recommendation_result.get("best_day_of_week", ""),
        # "best_airline":            recommendation_result.get("best_airline"),
        # "time_slots":              recommendation_result.get("time_slots", []),

        # # Counterfactual (auto what-if: 3 hours earlier)
        # "counterfactual": counterfactual_result,
        
        "dep_probability": dep_probability,
        "delay_class_dep": delay_class_dep,
        "travel_insight_": travel_insight

        # "prediction_id": prediction.id,
        # "flight_id": flight.id,
    }