from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from backend.main import app  # your FastAPI app
from datetime import datetime, timedelta, timezone

def test_user_prediction_report(client: TestClient, setup_test_data):
    user_email = setup_test_data["user"].email
    from_date = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    to_date = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()

    response = client.get(
        "/user-prediction-report",
        params={"user_email": user_email, "from_date": from_date, "to_date": to_date},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total_predictions"] == 1
    assert data["predictions"][0]["user_email"] == user_email

def test_admin_prediction_report(client: TestClient, setup_test_data):
    flight = setup_test_data["flight"]
    from_date = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    to_date = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()

    response = client.get(
        "/admin-prediction-report",
        params={
            "airline": flight.airline,
            "aircraft": flight.aircraft,
            "destination": flight.arrival_airport,
            "from_date": from_date,
            "to_date": to_date,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total_predictions"] == 1