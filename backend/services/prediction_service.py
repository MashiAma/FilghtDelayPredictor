from sqlalchemy.orm import Session
from models_sql.prediction import Prediction
from schemas.prediction import PredictionRequest
from datetime import datetime

import joblib
import numpy as np
import lightgbm as lgb

# explainer_dep = shap.Explainer(model_dep)
# explainer_arr = shap.Explainer(model_arr)

# model_dep = joblib.load("models/flight_delay_model.pkl")
# model_arr = joblib.load("models/flight_delay_model.pkl")

# Load LightGBM Booster models
model_dep = lgb.Booster(model_file="models/flight_delay_model.txt")
model_arr = lgb.Booster(model_file="models/flight_delay_model.txt")
model_columns = joblib.load("models/model_columns.pkl")
label_encoders = joblib.load("models/label_encoders.pkl")

def preprocess_input(features: dict) -> np.ndarray:
    processed = []

    for col in model_columns:

        if col not in features:
            raise ValueError(f"Missing required feature: {col}")

        value = features[col]

        if col in label_encoders:
            le = label_encoders[col]

            if value not in le.classes_:
                raise ValueError(
                    f"Unseen category '{value}' for feature '{col}'"
                )

            value = le.transform([value])[0]

        processed.append(value)

    return np.array([processed], dtype=float)

def classify(prob: float) -> str:
    """Classifies delay severity based on probability thresholds"""
    if prob < 0.3:
        return "On-time"
    elif prob < 0.7:
        return "Minor"
    else:
        return "Major"

def save_prediction(features: dict):
    """
    Predicts departure and arrival delay probabilities and classes
    features: dict with keys exactly matching training feature names
    """
    X = preprocess_input(features)

    # LightGBM Booster prediction returns probability of class 1
    dep_prob = model_dep.predict(X)[0]
    arr_prob = model_arr.predict(X)[0]

    return {
        "dep_probability": float(dep_prob),
        "delay_class_dep": classify(dep_prob),
        "arr_probability": float(arr_prob),
        "delay_class_arr": classify(arr_prob),
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

