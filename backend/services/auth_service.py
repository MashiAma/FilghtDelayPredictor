from sqlalchemy.orm import Session
from models_sql.user import User
from passlib.context import CryptContext
from utils.password_utils import hash_password, verify_password

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

# --- Change password ---
# def change_user_password(db: Session, user: User, old_password: str, new_password: str):
#     if not verify_password(old_password, user.hashed_password):
#         return None
#     user.hashed_password = hash_password(new_password)
#     db.commit()
#     db.refresh(user)
#     return user

# services/user_service.py


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)

def change_user_password(db: Session, user: User, current_password: str, new_password: str, confirm_new_password: str):
    if not verify_password(current_password, user.password):
        return {"success": False, "message": "Current password is incorrect"}

    if new_password != confirm_new_password:
        return {"success": False, "message": "New passwords do not match"}

    if current_password == new_password:
        return {"success": False, "message": "New password must be different from current password"}

    # Hash and save
    user.password = hash_password(new_password)
    db.commit()

    return {"success": True, "message": "Password updated successfully"}


# --- Reset password ---
def reset_password(db: Session, email: str, new_password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user

# get all users
def get_all_users(db: Session):
    return db.query(User).all()