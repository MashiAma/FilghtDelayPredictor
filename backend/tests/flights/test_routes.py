from datetime import datetime, timedelta

def test_create_flight(client):
    flight_in = {
        "flight_number": "ROUTE123",
        "departure_airport": "CMB",
        "arrival_airport": "DXB",
        "scheduled_departure": (datetime.now() + timedelta(days=2)).isoformat(),
        "scheduled_arrival": (datetime.now() + timedelta(days=2, hours=3)).isoformat(),
        "airline": "RouteAir",
        "status": "Scheduled",
        "aircraft": "B737"
    }
    response = client.post("/flights/add-flight", json=flight_in)
    assert response.status_code == 200
    data = response.json()
    assert data["flight_number"] == "ROUTE123"

def test_list_flights(client, test_flight):
    response = client.get("/flights/get-All-flights")
    assert response.status_code == 200
    data = response.json()
    assert any(f["id"] == test_flight.id for f in data)

def test_update_flight_record(client, test_flight):
    update_data = {
        "status": "Cancelled"
    }
    response = client.put(f"/flights/update-flight/{test_flight.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Cancelled"

def test_fetch_departure_times(client, test_flight):
    flight_date = test_flight.scheduled_departure.date().isoformat()
    response = client.get("/flights/departure-times", params={
        "arrival": test_flight.arrival_airport,
        "airline": test_flight.airline,
        "flight_date": flight_date
    })
    assert response.status_code == 200
    data = response.json()
    assert any(f["flight_number"] == test_flight.flight_number for f in data)