#routers/flight.py

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from datetime import date
from schemas.flight import FlightCreate, FlightUpdate, FlightOut, DepartureTimeOut
from services.flight_service import (
    get_flights,
    add_flight,
    add_flights_from_csv,
    update_flight,
    fetch_departure_times
)
from utils.csv_validator import validate_flight_csv
from models_sql.flight import Flight
from typing import List

router = APIRouter()

@router.get("/get-All-flights", response_model=list[FlightOut])
def list_flights(db: Session = Depends(get_db)):
    flights = db.query(Flight).all()
    if not flights:
        raise HTTPException(status_code=404, detail="No flights found")
    return flights

# Add single flight (UI form)
@router.post("/add-flight", response_model=FlightOut)
def create_flight(flight_in: FlightCreate, db: Session = Depends(get_db)):
    return add_flight(db, flight_in)


# Bulk add flights (CSV)
@router.post("/upload-flight-csv")
def upload_flights(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="CSV file required")
    return add_flights_from_csv(db, file)


# Update single flight (Admin UI)
@router.put("/update-flight/{flight_id}", response_model=FlightOut)
def update_flight_record(
    flight_id: int,
    flight_in: FlightUpdate,
    db: Session = Depends(get_db)
):
    flight = update_flight(db, flight_id, flight_in)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight


@router.get(
    "/departure-times",
    response_model=List[DepartureTimeOut]
)
def get_departure_times(
    arrival: str = Query(...),
    airline: str = Query(...),
    flight_date: date = Query(...),
    db: Session = Depends(get_db)
):
    return fetch_departure_times(
        db=db,
        arrival=arrival,
        airline=airline,
        flight_date=flight_date,
    )
# @router.post("/predict", response_model=PredictionOut)
# def submit_flight(flight_in: FlightCreate, db: Session = Depends(get_db)):
#     # Step 1: Create flight entry
#     flight = create_flight(db, flight_in.dict())
#     # Step 2: Generate prediction
#     prediction = create_prediction(db, flight)
#     return prediction

# @router.get("/{flight_id}/history", response_model=list[PredictionOut])
# def flight_history(flight_id: int, db: Session = Depends(get_db)):
#     history = get_prediction_history(db, flight_id)
#     if not history:
#         raise HTTPException(status_code=404, detail="No predictions found for this flight")
#     return history
