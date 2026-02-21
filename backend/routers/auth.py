from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.user import UserCreate, UserLogin, UserOut, UserUpdateProfile, VerifyPassword, ChangePassword, ResetPasswordRequest, ResetPasswordVerify, UserUpdateStatus
from services.auth_service import create_user, authenticate_user,get_user_by_email, update_user_profile,set_user_status, change_user_password, verify_current_password, request_password_reset, verify_and_reset_password
from models_sql.user import User
from typing import List
from utils.auth_utils import get_current_user

router = APIRouter()

# --- Register ---
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db=db,
        full_name=user_in.full_name,
        email=user_in.email,
        password=user_in.password,
        phone=user_in.phone,
        role=user_in.role,)
    return user

# --- Login ---
@router.post("/login", response_model=UserOut)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

# GET user details by email
@router.get("/get-user-by-email/{email}", response_model=UserOut)
def read_user(email: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# UPDATE profile (own profile or admin updating any user)
@router.put("/update-profile/{email}", response_model=UserOut)
def update_profile(email: str, user_in: UserUpdateProfile, db: Session = Depends(get_db)):
    update_data = user_in.model_dump(exclude_unset=True)
    user = update_user_profile(db, email, **update_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# UPDATE user status (admin only)
@router.patch("/account-status/{email}", response_model=UserOut)
def update_user_status(
    email: str,
    status_in: UserUpdateStatus,
    db: Session = Depends(get_db)
):
    user = set_user_status(db, email, status_in.is_active)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/verify-password")
def verify_password_endpoint(
    payload: VerifyPassword,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Step 2: verify password
    if not verify_current_password(user, payload.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {"success": True}

@router.put("/change-password")
def change_password(
    passwords: ChangePassword,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == passwords.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    result = change_user_password(
        db,
        user,
        # passwords.old_password,
        passwords.new_password,
        passwords.confirm_new_password
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return result

@router.post("/reset-password-request")
def request_reset(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    result = request_password_reset(db, payload.email)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Verification code sent to email"}

@router.post("/reset-password-verify")
def verify_reset(
    payload: ResetPasswordVerify,
    db: Session = Depends(get_db)
):
    result = verify_and_reset_password(
        db,
        payload.email,
        payload.code,
        payload.new_password
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return result


#get all users
@router.get("/get-all-users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users