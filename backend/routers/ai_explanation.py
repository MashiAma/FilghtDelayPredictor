from fastapi import APIRouter, Depends, HTTPException
from schemas.counterfactual import CounterfactualRequest, CounterfactualResponse
from services.counterfactual_service import run_counterfactual
from services.impact_service import analyze_passenger_impact
from schemas.narrative import NarrativeRequest, NarrativeResponse
from services.narrative_service import generate_narrative
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.recommendation import RecommendationRequest, RecommendationResponse
from services.recommendation_service import build_recommendations

router = APIRouter()


@router.post("/counterfactual", response_model=CounterfactualResponse)
def get_counterfactual(payload: CounterfactualRequest):
    """
    What-if simulator: change departure time, airline, or day
    and see how delay probability changes vs baseline.
    """
    try:
        result = run_counterfactual(
            baseline_features=payload.baseline_features,
            new_departure_hour=payload.new_departure_hour,
            new_departure_day_offset=payload.new_departure_day_offset,
            new_airline=payload.new_airline,
            new_route=payload.new_route,
        )
        return CounterfactualResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/impact")
def get_passenger_impact(payload: NarrativeRequest):
    """
    Passenger impact analysis — who suffers most and why.
    Rule-based, deterministic, no LLM, no API cost.
    """
    try:
        result = analyze_passenger_impact(
            features=payload.features,
            dep_probability=payload.dep_probability,
            delay_class_dep=payload.delay_class_dep,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/narrative", response_model=NarrativeResponse)
def get_narrative(payload: NarrativeRequest):
    """
    AI-powered operational narrative for a flight delay prediction.
    Uses Groq (free) + LangChain with strict structured prompting.
    """
    try:
        result = generate_narrative(
            features=payload.features,
            dep_probability=payload.dep_probability,
            delay_class_dep=payload.delay_class_dep,
        )

        impact = analyze_passenger_impact(
            features=payload.features,
            dep_probability=payload.dep_probability,
            delay_class_dep=payload.delay_class_dep,
        )

        return NarrativeResponse(
            narrative=result.get("narrative", ""),
            reason_breakdown=result.get("reason_breakdown", {}),
            confidence_explanation=result.get("confidence_explanation", ""),
            passenger_impact=impact["primary_impact"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Narrative generation failed: {str(e)}")


@router.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(payload: RecommendationRequest, db: Session = Depends(get_db)):
    """
    Returns best departure time, day, and airline recommendations
    based on historical prediction data for the given route.
    """
    try:
        result = build_recommendations(
            db=db,
            origin=payload.origin_code,
            destination=payload.destination_code,
            airline=payload.airline,
            target_date=payload.target_date,
        )
        return RecommendationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))