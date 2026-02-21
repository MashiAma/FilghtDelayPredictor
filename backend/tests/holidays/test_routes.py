from datetime import date, timedelta

def test_create_holiday(client):
    holiday_in = {
        "holiday_date": (date.today() + timedelta(days=3)).isoformat(),  # unique
        "holiday_name": "Route Holiday Test",
        "holiday_type": "Festival"
    }
    response = client.post("/holidays/add-holiday", json=holiday_in)
    assert response.status_code == 200
    data = response.json()
    assert data["holiday_name"] == "Route Holiday Test"
    assert data["is_festival_period"] is True

def test_list_holidays(client, test_holiday):
    response = client.get("/holidays/get-all-holidays")
    assert response.status_code == 200
    data = response.json()
    assert any(h["id"] == test_holiday.id for h in data)

def test_update_holiday_record(client, test_holiday):
    update_data = {
        "holiday_name": "Route Updated Holiday",
        "holiday_type": test_holiday.holiday_type  # required field
    }
    response = client.put(f"/holidays/update-holiday/{test_holiday.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["holiday_name"] == "Route Updated Holiday"