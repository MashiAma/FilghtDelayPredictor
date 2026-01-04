from sqlalchemy.orm import Session
from models_sql.user import User
from utils.password_utils import hash_password, verify_password

# --- Register user ---
def create_user(db: Session, full_name: str, email: str, password: str, phone: str | None = None):
    hashed = hash_password(password)
    user = User(
        full_name=full_name,
        email=email,
        hashed_password=hashed,
        phone=phone
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

# --- Update profile ---
def update_user_profile(db: Session, user: User, updates: dict):
    for key, value in updates.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

# --- Change password ---
def change_user_password(db: Session, user: User, old_password: str, new_password: str):
    if not verify_password(old_password, user.hashed_password):
        return None
    user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user

# --- Reset password ---
def reset_password(db: Session, email: str, new_password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user
