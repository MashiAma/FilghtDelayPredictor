from flask import Flask, request, jsonify
import pandas as pd
import joblib
from utils.ai_helper import get_explanation

app = Flask(__name__)

# Load model and dataset
model = joblib.load("models/flight_model.pkl")
df = pd.read_csv("data/flights.csv")

# ---------------- Prediction Endpoint ----------------
@app.route("/predict", methods=["POST"])
def predict_delay():
    data = request.json
    features = [[
        data["weather_code"],
        data["day_of_week"],
        data["holiday_flag"],
        data["traffic_level"]
    ]]
    prediction = model.predict(features)[0]
    prob = model.predict_proba(features)[0][1]
    return jsonify({"delay_prediction": int(prediction), "delay_probability": float(prob)})

# ---------------- AI Explanation Endpoint ----------------
@app.route("/explain", methods=["POST"])
def explain_delay():
    data = request.json
    explanation = get_explanation(data["flight_info"])
    return jsonify({"explanation": explanation})

# ---------------- Flight Recommendation Endpoint ----------------
@app.route("/recommend", methods=["GET"])
def recommend():
    departure_city = request.args.get("departure_city")
    arrival_city = request.args.get("arrival_city")
    filtered = df[(df['departure_city'] == departure_city) & (df['arrival_city'] == arrival_city)]
    best_day = filtered.groupby("day_of_week")["departure_delay_min"].mean().idxmin()
    return jsonify({"best_day_to_fly": best_day})

if __name__ == "__main__":
    app.run(debug=True)

