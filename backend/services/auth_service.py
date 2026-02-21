from sqlalchemy.orm import Session
from models_sql.user import User
from passlib.context import CryptContext
from utils.password_utils import hash_password, verify_password
from models_sql.password_reset import PasswordResetCode
from utils.email_utils import send_email_alert
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Register user ---
def create_user(db: Session, full_name: str, email: str, password: str, phone: str | None = None, role: str = "normal"):
    hashed = hash_password(password)
    user = User(
        full_name=full_name,
        email=email,
        hashed_password=hashed,
        phone=phone,
        role=role or "normal",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# --- Authenticate login ---
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Get user by email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Update user profile
def update_user_profile(db: Session, email: str, **kwargs):
    user = get_user_by_email(db, email)
    if not user:
        return None

    for key, value in kwargs.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


# Update user status (admin only)
def set_user_status(db: Session, email: str, is_active: bool):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None

    user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user


# services/user_service.py
def verify_current_password(user, password: str) -> bool:
    # user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    return verify_password(password, user.hashed_password)


def change_user_password(
    db: Session,
    user: User,
    # old_password: str,
    new_password: str,
    confirm_new_password: str
):


    if new_password != confirm_new_password:
        return {"success": False, "message": "Passwords do not match"}

    # if old_password == new_password:
    #     return {"success": False, "message": "New password must be different"}

    user.hashed_password = hash_password(new_password)
    db.commit()

    return {"success": True, "message": "Password changed successfully"}


def request_password_reset(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None

    code = str(random.randint(100000, 999999))

    # Remove existing codes
    db.query(PasswordResetCode).filter(
        PasswordResetCode.email == email
    ).delete()

    reset = PasswordResetCode(email=email, code=code)
    db.add(reset)
    db.commit()

    send_email_alert(
        to_email=email,
        subject="Password Reset Verification Code",
        body=f"Your password reset code is: {code}"
    )

    return True

def verify_and_reset_password(
    db: Session,
    email: str,
    code: str,
    new_password: str
):
    record = db.query(PasswordResetCode).filter(
        PasswordResetCode.email == email,
        PasswordResetCode.code == code
    ).first()

    if not record:
        return {"success": False, "message": "Invalid or expired code"}

    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"success": False, "message": "User not found"}

    user.hashed_password = hash_password(new_password)

    # cleanup
    db.delete(record)
    db.commit()

    return {"success": True, "message": "Password reset successfully"}

# get all users
def get_all_users(db: Session):
    return db.query(User).all()