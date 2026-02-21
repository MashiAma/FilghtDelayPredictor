from datetime import datetime, timedelta
from schemas.flight import FlightCreate, FlightUpdate
from services.flight_service import add_flight, update_flight, get_flights

def test_add_flight(db):
    flight_in = FlightCreate(
        flight_number="UNIT123",
        departure_airport="CMB",
        arrival_airport="DEL",
        scheduled_departure=datetime.now() + timedelta(days=5),
        scheduled_arrival=datetime.now() + timedelta(days=5, hours=2),
        airline="UnitAir",
        status="Scheduled",
        aircraft="A320"
    )
    flight = add_flight(db, flight_in)
    assert flight.id is not None
    assert flight.flight_number == "UNIT123"

def test_update_flight(db, test_flight):
    update_in = FlightUpdate(
        status="Delayed"
    )
    updated = update_flight(db, test_flight.id, update_in)
    assert updated.status == "Delayed"

def test_get_flights(db, test_flight):
    flights = get_flights(db)
    assert len(flights) >= 1
    assert any(f.id == test_flight.id for f in flights)