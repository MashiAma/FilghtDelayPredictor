
from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from models_sql.flight import Flight
from models_sql.prediction import Prediction
from database.connection import get_db
from datetime import datetime, date, time
from schemas.prediction import PredictionRequest
from services.report_service import get_user_predictions_by_period
from schemas.prediction import PredictionHistoryResponse
from typing import Optional
from services.report_service import get_users_report

router = APIRouter()

#Reports
@router.get("/user-prediction-report")
def user_prediction_report(
    user_email: Optional[str] = Query(None),
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    return get_user_predictions_by_period(
        db=db,
        user_email=user_email,
        from_date=from_date,
        to_date=to_date
    )

@router.get("/admin-prediction-report")
def user_flight_report(
    airline: Optional[str] = Query(None),
    aircraft: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
    from_date: datetime = Query(...),
    to_date: datetime = Query(...),
    db: Session = Depends(get_db)
):
    return get_users_report(
        db=db,
        airline=airline,
        aircraft=aircraft,
        destination=destination,
        from_date=from_date,
        to_date=to_date
    )