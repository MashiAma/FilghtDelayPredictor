#services/flight_service.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from models_sql.flight import Flight
from datetime import datetime, date
import csv
from io import StringIO
from fastapi import UploadFile
from schemas.flight import FlightCreate, FlightUpdate

def get_flights(db: Session):
    return db.query(Flight).all()


def add_flight(db: Session, flight_in: FlightCreate):
    existing = db.query(Flight).filter(
        Flight.flight_number == flight_in.flight_number,
        Flight.scheduled_departure == flight_in.scheduled_departure
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Flight with this number and departure already exists")

    flight = Flight(**flight_in.model_dump())
    db.add(flight)
    db.commit()
    db.refresh(flight)
    return flight


def add_flights_from_csv(db: Session, file: UploadFile):
    content = file.file.read().decode("utf-8-sig")  # handle BOM
    reader = csv.DictReader(StringIO(content))
    
    reader.fieldnames = [h.strip() for h in reader.fieldnames]
    print("CSV headers detected:", reader.fieldnames)  # debug

    added = 0
    errors = []  # collect all errors

    for i, row in enumerate(reader, start=2):  # start=2 because row 1 is header
        row = {k.strip(): v.strip() if isinstance(v, str) else v for k, v in row.items()}

        # Check required columns
        required_cols = ["flight_number", "departure_airport", "arrival_airport", 
                         "scheduled_departure", "scheduled_arrival", "airline", "status", "aircraft"]
        missing_cols = [col for col in required_cols if not row.get(col)]
        if missing_cols:
            errors.append({
                "row": i,
                "error": f"Missing required columns: {', '.join(missing_cols)}",
                "row_data": row
            })
            continue

        # Parse dates
        try:
            scheduled_dep = datetime.strptime(row["scheduled_departure"], "%m/%d/%Y %H:%M")
            scheduled_arr = datetime.strptime(row["scheduled_arrival"], "%m/%d/%Y %H:%M")
        except ValueError as e:
            errors.append({
                "row": i,
                "error": f"Invalid date format: {e}",
                "row_data": row
            })
            continue

        # Check for duplicates
        exists = db.query(Flight).filter(
            Flight.flight_number == row["flight_number"],
            Flight.scheduled_departure == scheduled_dep
        ).first()
        if exists:
            errors.append({
                "row": i,
                "error": "Duplicate flight record",
                "row_data": row
            })
            continue

        # Add flight
        flight = Flight(
            flight_number=row["flight_number"],
            departure_airport=row["departure_airport"],
            arrival_airport=row["arrival_airport"],
            scheduled_departure=scheduled_dep,
            scheduled_arrival=scheduled_arr,
            airline=row["airline"],
            status=row["status"],
            aircraft=row["aircraft"],
        )

        db.add(flight)
        added += 1

    db.commit()

    return {
        "added_records": added,
        "errors": errors
    }


def update_flight(db: Session, flight_id: int, flight_in: FlightUpdate):
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        return None

    update_data = flight_in.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(flight, key, value)

    db.commit()
    db.refresh(flight)
    return flight

def fetch_departure_times(
    db: Session,
    arrival: str,
    airline: str,
    flight_date: date,
):
    flights = (
        db.query(Flight)
        .filter(
            Flight.arrival_airport == arrival,
            Flight.airline == airline,
            func.date(Flight.scheduled_departure) == flight_date
        )
        .order_by(Flight.scheduled_departure.asc())
        .all()
    )

    return [
        {
            "scheduled_departure": f.scheduled_departure,
            "departure_time": f.scheduled_departure.strftime("%H:%M"),
            "arrival_airport": f.arrival_airport,
            "airline": f.airline,
            "flight_number": f.flight_number,
        }
        for f in flights
    ]