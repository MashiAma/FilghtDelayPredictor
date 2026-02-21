# backend/tests/user/test_services.py
from services.auth_service import (
    authenticate_user, get_user_by_email,
    update_user_profile, set_user_status,
    verify_current_password, change_user_password
)

def test_authenticate_user(db, test_user):
    user = authenticate_user(db, test_user.email, "password123")
    assert user is not None
    assert user.email == test_user.email

def test_update_user_profile(db, test_user):
    updated = update_user_profile(db, test_user.email, full_name="Updated Name")
    assert updated.full_name == "Updated Name"

def test_set_user_status(db, test_user):
    updated = set_user_status(db, test_user.email, is_active=False)
    assert updated.is_active is False

def test_change_user_password(db, test_user):
    result = change_user_password(db, test_user, "newpass123", "newpass123")
    assert result["success"] is True
    # verify password
    assert verify_current_password(test_user, "newpass123")