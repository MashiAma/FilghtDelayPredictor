# backend/tests/user/test_routes.py
from fastapi.testclient import TestClient
import pytest
import uuid

def test_register_and_login(client: TestClient):
    email = f"{uuid.uuid4()}@example.com"
    payload = {
        "full_name": "John Doe",
        "phone":"0000000",
        "email": email,
        "password": "password123",
        "phone": "1234567890"
    }
    # Register
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == payload["email"]

    # Login
    login_payload = {"email": email, "password": "password123"}
    response = client.post("/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == payload["full_name"]

def test_update_profile(client: TestClient, test_user):
    payload = {"full_name": "John Smith", "phone": "9876543210"}
    response = client.put(f"/auth/update-profile/{test_user.email}", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "John Smith"
    assert data["phone"] == "9876543210"

def test_get_user_by_email(client: TestClient, test_user):
    response = client.get(f"/auth/get-user-by-email/{test_user.email}")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email

def test_change_password(client: TestClient, test_user):
    payload = {
        "email": test_user.email,
        "new_password": "newpassword123",
        "confirm_new_password": "newpassword123"
    }
    response = client.put("/auth/change-password", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True