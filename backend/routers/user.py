# # backend/routers/user.py

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session

# # from services.auth_service import get_current_user, hash_password
# from database.connection import get_db
# from models_sql.user import User
# from schemas.user import UpdateProfile, UserOut

# router = APIRouter(tags=["User"])


# # --- Update Profile ---
# @router.put("/update", response_model=UserOut)
# def update_profile(
#     data: UpdateProfile,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     if data.full_name:
#         current_user.full_name = data.full_name
#     if data.phone:
#         current_user.phone = data.phone
#     if data.email_alert_opt is not None:
#         current_user.email_alert_opt = data.email_alert_opt
#     db.commit()
#     db.refresh(current_user)
#     return current_user
