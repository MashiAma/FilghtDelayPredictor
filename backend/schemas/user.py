from pydantic import BaseModel, EmailStr
from typing import Optional

# --- For creating a new user ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str | None = None
    role: str | None = None

# --- For logging in ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- For response ---
class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True  # pydantic v2 replacement for orm_mode

# --- Update profile ---
class UserUpdateProfile(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

# upadte user status
class UserUpdateStatus(BaseModel):
    is_active: bool

# --- Change password ---
class ChangePassword(BaseModel):
    old_password: str
    new_password: str
    confirm_new_password:str

# --- Reset password ---
class ResetPassword(BaseModel):
    email: EmailStr
    new_password: str
