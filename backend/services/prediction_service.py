from sqlalchemy.orm import Session
from models_sql.prediction import Prediction
from schemas.prediction import PredictionRequest
from datetime import datetime

import joblib
import numpy as np

model_dep = joblib.load("models/flight_delay_model.pkl")
model_arr = joblib.load("models/flight_delay_model.pkl")

def predict(features: dict):
    X = np.array([list(features.values())])

    dep_prob = model_dep.predict_proba(X)[0][1]
    arr_prob = model_arr.predict_proba(X)[0][1]

    def classify(p):
        if p < 0.3:
            return "On-time"
        if p < 0.7:
            return "Minor"
        return "Major"

    return {
        "dep_probability": dep_prob,
        "dep_delay_class": classify(dep_prob),
        "arr_probability": arr_prob,
        "arr_delay_class": classify(arr_prob),
    }

# def add_prediction(db: Session, pred_in: PredictionCreate):
#     prediction = Prediction(**pred_in.model_dump())
#     db.add(prediction)
#     db.commit()
#     db.refresh(prediction)
#     return prediction

# def get_predictions_by_flight(db: Session, flight_id: int):
#     return db.query(Prediction).filter(Prediction.flight_id == flight_id).order_by(Prediction.created_at.desc()).all()

# def get_latest_prediction(db: Session, flight_id: int):
#     return db.query(Prediction).filter(Prediction.flight_id == flight_id).order_by(Prediction.created_at.desc()).first()

# def delete_prediction(db: Session, prediction_id: int):
#     pred = db.query(Prediction).filter(Prediction.id == prediction_id).first()
#     if not pred:
#         return None
#     db.delete(pred)
#     db.commit()
#     return pred
