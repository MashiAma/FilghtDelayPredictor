# backend/tests/user/test_edge_cases.py
from fastapi.testclient import TestClient
from unittest.mock import patch
from services.auth_service import request_password_reset

def test_register_duplicate_email(client: TestClient, test_user):
    payload = {
        "full_name": "Another User",
        "email": test_user.email,
        "password": "password123"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 400

def test_login_wrong_password(client: TestClient, test_user):
    payload = {"email": test_user.email, "password": "wrongpassword"}
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 401

def test_password_reset_flow(db, test_user):
    # mock sending email
    with patch("services.auth_service.send_email_alert") as mock_email:
        result = request_password_reset(db, test_user.email)
        assert result is True
        mock_email.assert_called_once()