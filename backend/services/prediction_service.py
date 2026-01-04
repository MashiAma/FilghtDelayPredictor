from sqlalchemy.orm import Session
from models_sql.prediction import Prediction
from schemas.prediction import PredictionCreate
from datetime import datetime

def add_prediction(db: Session, pred_in: PredictionCreate):
    prediction = Prediction(**pred_in.model_dump())
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction

def get_predictions_by_flight(db: Session, flight_id: int):
    return db.query(Prediction).filter(Prediction.flight_id == flight_id).order_by(Prediction.created_at.desc()).all()

def get_latest_prediction(db: Session, flight_id: int):
    return db.query(Prediction).filter(Prediction.flight_id == flight_id).order_by(Prediction.created_at.desc()).first()

def delete_prediction(db: Session, prediction_id: int):
    pred = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not pred:
        return None
    db.delete(pred)
    db.commit()
    return pred
