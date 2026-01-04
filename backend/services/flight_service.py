#services/flight_service.py

from sqlalchemy.orm import Session
from models_sql.flight import Flight
from datetime import datetime
import csv
from io import StringIO
from fastapi import UploadFile
from schemas.flight import FlightCreate, FlightUpdate

def get_flights_by_arrival(db: Session, airport: str):
    return (
        db.query(Flight)
        .filter(Flight.arrival_airport == airport.upper())
        .all()
    )

def add_flight(db: Session, flight_in: FlightCreate):
    existing = db.query(Flight).filter(
        Flight.flight_number == flight_in.flight_number,
        Flight.scheduled_departure == flight_in.scheduled_departure
    ).first()

    if existing:
        return existing  # prevent duplicates

    flight = Flight(**flight_in.model_dump())
    db.add(flight)
    db.commit()
    db.refresh(flight)
    return flight


def add_flights_from_csv(db: Session, file: UploadFile):
    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(StringIO(content))

    added = 0

    for row in reader:
        scheduled_dep = datetime.fromisoformat(row["scheduled_departure"])
        exists = db.query(Flight).filter(
            Flight.flight_number == row["flight_number"],
            Flight.scheduled_departure == scheduled_dep
        ).first()

        if exists:
            continue

        flight = Flight(
            flight_number=row["flight_number"].strip(),
            departure_airport=row["departure_airport"].strip().strip(),
            arrival_airport=row["arrival_airport"].strip().strip(),
            # scheduled_departure=row["scheduled_departure"],
            # scheduled_arrival=row["scheduled_arrival"],
            scheduled_departure=datetime.fromisoformat(row["scheduled_departure"]),
            scheduled_arrival=datetime.fromisoformat(row["scheduled_arrival"]),
            airline=row["airline"].strip(),
            status=row["status"].strip(),
            aircraft=row["aircraft"].strip(),
        )
        db.add(flight)
        added += 1

    db.commit()
    return {"added_records": added}


def update_flight(db: Session, flight_id: int, flight_in: FlightUpdate):
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        return None

    for field, value in flight_in.model_dump(exclude_unset=True).items():
        setattr(flight, field, value)

    db.commit()
    db.refresh(flight)
    return flight




# from sqlalchemy.orm import Session
# from models_sql.flight import Flight
# from services.prediction_service import add_prediction
# from schemas.flight import FlightCreate, FlightUpdate
# from schemas.prediction import PredictionCreate
# from datetime import datetime

# # Dummy ML model function (replace with actual ML model)
# def predict_delay(flight: Flight):
#     """
#     Return a sample prediction for demonstration.
#     Replace this with actual ML model inference.
#     """
#     # Example logic: randomly generate delay
#     import random
#     predicted_delay = round(random.uniform(0, 120), 2)  # minutes
#     if predicted_delay < 15:
#         delay_class = "on-time"
#     elif predicted_delay < 60:
#         delay_class = "short"
#     else:
#         delay_class = "long"

#     probability = round(random.uniform(0.6, 0.99), 2)
#     return predicted_delay, delay_class, probability


# def add_flight(db: Session, flight_in: FlightCreate):
#     existing = db.query(Flight).filter(
#         Flight.flight_number == flight_in.flight_number,
#         Flight.scheduled_departure == flight_in.scheduled_departure
#     ).first()

#     if existing:
#         flight = existing
#     else:
#         flight = Flight(**flight_in.model_dump())
#         db.add(flight)
#         db.commit()
#         db.refresh(flight)

#     # Generate prediction
#     predicted_delay, delay_class, probability = predict_delay(flight)
#     pred_in = PredictionCreate(
#         flight_id=flight.id,
#         predicted_delay_min=predicted_delay,
#         delay_class=delay_class,
#         probability=probability
#     )
#     add_prediction(db, pred_in)

#     return flight


# def update_flight(db: Session, flight_id: int, flight_in: FlightUpdate):
#     flight = db.query(Flight).filter(Flight.id == flight_id).first()
#     if not flight:
#         return None

#     for field, value in flight_in.model_dump(exclude_unset=True).items():
#         setattr(flight, field, value)

#     db.commit()
#     db.refresh(flight)

#     # Generate new prediction after update
#     predicted_delay, delay_class, probability = predict_delay(flight)
#     pred_in = PredictionCreate(
#         flight_id=flight.id,
#         predicted_delay_min=predicted_delay,
#         delay_class=delay_class,
#         probability=probability
#     )
#     add_prediction(db, pred_in)

#     return flight





# import joblib
# model = joblib.load("models/flight_delay_model.pkl")

# def predict_delay(flight: Flight):
#     # Prepare features for the ML model
#     features = [
#         flight.departure_airport,
#         flight.arrival_airport,
#         flight.scheduled_departure.hour,
#         flight.airline,
#         # add other features used in training
#     ]
#     # Model prediction
#     predicted_delay = model.predict([features])[0]
#     # Classification
#     if predicted_delay < 15:
#         delay_class = "on-time"
#     elif predicted_delay < 60:
#         delay_class = "short"
#     else:
#         delay_class = "long"

#     probability = 0.9  # optional confidence score
#     return predicted_delay, delay_class, probability





# def create_prediction(db: Session, flight: Flight):
#     predicted_delay, delay_class, probability = predict_delay(flight)
#     prediction = Prediction(
#         flight_id=flight.id,
#         predicted_delay_min=predicted_delay,
#         delay_class=delay_class,
#         probability=probability,
#         created_at=datetime.utcnow()
#     )
#     db.add(prediction)
#     db.commit()
#     db.refresh(prediction)
#     return prediction

# def get_prediction_history(db: Session, flight_id: int):
#     return db.query(Prediction).filter(Prediction.flight_id == flight_id).all()
