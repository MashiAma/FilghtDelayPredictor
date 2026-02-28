# services/prediction_service.py
from sqlalchemy.orm import Session
import joblib
import numpy as np
import lightgbm as lgb
import shap

# model_dep = joblib.load("models/flight_delay_model.pkl")
# model_arr = joblib.load("models/flight_delay_model.pkl")

# Load LightGBM Booster models
model_dep = lgb.Booster(model_file="models/flight_delay_model.txt")
model_columns = joblib.load("models/model_columns.pkl")
label_encoders = joblib.load("models/label_encoders.pkl")

# Load models
explainer_dep = shap.Explainer(model_dep)


# Preprocessing
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
    if prob < 0.4:
        return "On-time"
    else:
        return "Major"

# SHAP Feature Importance
# def get_top_features(X: np.ndarray, top_n=10):
#     shap_values = explainer_dep(X)
#     contributions = dict(zip(model_columns, shap_values.values[0]))
#     sorted_features = sorted(contributions.items(), key=lambda x: abs(x[1]), reverse=True)
#     return [{"feature": f, "impact": float(v)} for f, v in sorted_features[:top_n]]
def get_top_features(explainer, X, top_n=5):
    shap_values = explainer.shap_values(X)
    contributions = dict(zip(model_columns, shap_values[0]))
    sorted_features = sorted(contributions.items(), key=lambda x: abs(x[1]), reverse=True)
    return sorted_features[:top_n]

# # Counterfactual simulation
# def simulate_counterfactual(features: dict, shift_hours: int):
#     modified = features.copy()
#     modified["scheduled_depature_time"] += shift_hours * 60
#     X = preprocess_input(modified)
#     prob = model_dep.predict(X)[0]
#     return float(prob)

# Main prediction function
def save_prediction(features: dict):    
    """
    Predicts departure and arrival delay probabilities and classes
    features: dict with keys exactly matching training feature names
    """
    X = preprocess_input(features)

    # LightGBM Booster prediction returns probability of class 1
    dep_prob = model_dep.predict(X)[0]
    dep_class = classify(dep_prob)
    # dep_top_features = get_top_features(X)

    dep_top = get_top_features(explainer_dep, X)

    # shifted_prob = simulate_counterfactual(features, 2)
    # risk_change = shifted_prob - dep_prob
    # recommendation = (
    #     "Departing 2 hours later reduces predicted delay risk."
    #     if shifted_prob < dep_prob
    #     else "No improvement observed with departure time shift."
    # )

    # human_group = (
    #     "Late-night leisure travelers"
    #     if features.get("scheduled_late_night_departure") and features.get("is_long_weekend")
    #     else "Short-haul passengers"
    #     if features.get("is_short_haul")
    #     else "General passengers"
    # )

    return {
        "dep_probability": float(dep_prob),
        "delay_class_dep": classify(dep_prob),
        # "dep_top_features": dep_top_features,
        "dep_top_features": dep_top,
        # "counterfactual": {
        #     "baseline": float(dep_prob),
        #     "shifted_plus_2h": shifted_prob,
        #     "risk_change": float(risk_change),
        # },
        # "recommendation": recommendation,
        # "human_impact": {
        #     "affected_group": human_group,
        #     "severity_score": float(dep_prob),
        # },
    }