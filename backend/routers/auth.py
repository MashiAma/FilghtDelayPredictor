from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.user import UserCreate, UserLogin, UserOut, UpdateProfile, ChangePassword, ResetPassword
from services.auth_service import create_user, authenticate_user, update_user_profile, change_user_password, reset_password
from models_sql.user import User

router = APIRouter()

# --- Register ---
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, user_in.full_name, user_in.email, user_in.password, user_in.phone)
    return user

# --- Login ---
@router.post("/login", response_model=UserOut)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

# --- Update profile ---
@router.put("/update-profile/{user_id}", response_model=UserOut)
def update_profile(user_id: int, updates: UpdateProfile, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = update_user_profile(db, user, updates.dict(exclude_unset=True))
    return updated_user

# --- Change password ---
@router.put("/change-password/{user_id}")
def change_password(user_id: int, passwords: ChangePassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    updated = change_user_password(db, user, passwords.old_password, passwords.new_password)
    if not updated:
        raise HTTPException(status_code=400, detail="Old password incorrect")
    return {"message": "Password changed successfully"}

# --- Reset password ---
@router.put("/reset-password")
def reset_password_endpoint(reset: ResetPassword, db: Session = Depends(get_db)):
    updated = reset_password(db, reset.email, reset.new_password)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password reset successfully"}
