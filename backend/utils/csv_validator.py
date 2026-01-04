#utils/csv_validator

import csv
from datetime import datetime

REQUIRED_COLUMNS = {
    "flight_number",
    "departure_airport",
    "arrival_airport",
    "scheduled_departure",
    "scheduled_arrival",
    "airline",
    "status",
    "aircraft",
}

def validate_flight_csv(upload_file):
    content = upload_file.file.read().decode("utf-8").splitlines()
    reader = csv.DictReader(content)

    if not REQUIRED_COLUMNS.issubset(reader.fieldnames):
        missing = REQUIRED_COLUMNS - set(reader.fieldnames)
        raise ValueError(f"Missing columns: {missing}")

    flights = []

    for row in reader:
        flights.append({
            "flight_number": row["flight_number"].strip(),
            "departure_airport": row["departure_airport"].strip(),
            "arrival_airport": row["arrival_airport"].strip(),
            "scheduled_departure": datetime.fromisoformat(row["scheduled_departure"]),
            "scheduled_arrival": datetime.fromisoformat(row["scheduled_arrival"]),
            "airline": row["airline"].strip(),
            "status": row["status"].strip(),
            "aircraft": row["aircraft"].strip(),
        })

    return flights



REQUIRED_COLUMNS_HOLIDAY = {"holiday_date", "holiday_name", "holiday_type"}

def validate_holiday_csv(upload_file):
    content = upload_file.file.read().decode("utf-8").splitlines()
    reader = csv.DictReader(content)

    if not REQUIRED_COLUMNS_HOLIDAY.issubset(reader.fieldnames):
        missing = REQUIRED_COLUMNS_HOLIDAY - set(reader.fieldnames)
        raise ValueError(f"Missing columns: {missing}")

    holidays = []
    for row in reader:
        holidays.append({
            "holiday_date": datetime.fromisoformat(row["holiday_date"]).date(),
            "holiday_name": row["holiday_name"].strip(),
            "holiday_type": row["holiday_type"].strip(),
        })
    return holidays
