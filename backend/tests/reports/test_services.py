from datetime import datetime, timedelta, timezone

def test_user_prediction_report(client, setup_test_data):
    from_date = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    to_date = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()

    response = client.get(
        "/user-prediction-report",
        params={"user_email": "user@test.com", "from_date": from_date, "to_date": to_date}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_predictions" in data
    assert data["total_predictions"] == len(setup_test_data["predictions"])

def test_admin_prediction_report(client, setup_test_data):
    from_date = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    to_date = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()

    response = client.get(
        "/admin-prediction-report",
        params={
            "from_date": from_date,
            "to_date": to_date,
            "airline": "TestAir",
            "aircraft": "TestAircraft",
            "destination": "DXB"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_predictions" in data
    assert data["total_predictions"] == len(setup_test_data["predictions"])