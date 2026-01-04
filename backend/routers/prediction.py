from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from services.prediction_service import (
    add_prediction,
    get_predictions_by_flight,
    get_latest_prediction,
    delete_prediction
)
from schemas.prediction import PredictionCreate, PredictionOut

router = APIRouter()

# Submit a prediction
@router.post("/", response_model=PredictionOut)
def submit_prediction(pred_in: PredictionCreate, db: Session = Depends(get_db)):
    return add_prediction(db, pred_in)

# Get all predictions for a flight
@router.get("/flight/{flight_id}", response_model=list[PredictionOut])
def predictions_for_flight(flight_id: int, db: Session = Depends(get_db)):
    return get_predictions_by_flight(db, flight_id)

# Get latest prediction for a flight
@router.get("/flight/{flight_id}/latest", response_model=PredictionOut)
def latest_prediction(flight_id: int, db: Session = Depends(get_db)):
    pred = get_latest_prediction(db, flight_id)
    if not pred:
        raise HTTPException(status_code=404, detail="No prediction found for this flight")
    return pred

# Delete a prediction (optional, admin)
@router.delete("/{prediction_id}", response_model=PredictionOut)
def remove_prediction(prediction_id: int, db: Session = Depends(get_db)):
    pred = delete_prediction(db, prediction_id)
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return pred
