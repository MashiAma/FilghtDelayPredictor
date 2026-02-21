from pydantic import BaseModel, EmailStr,ConfigDict
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

    model_config = ConfigDict(from_attributes=True)

# --- Update profile ---
class UserUpdateProfile(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

# upadte user status
class UserUpdateStatus(BaseModel):
    is_active: bool

# --- Change password ---
class VerifyPassword(BaseModel):
    email: EmailStr
    password: str

class ChangePassword(BaseModel):
    email: EmailStr
    # old_password: str
    new_password: str
    confirm_new_password:str

# --- Request reset ---
class ResetPasswordRequest(BaseModel):
    email: EmailStr


# --- Verify reset ---
class ResetPasswordVerify(BaseModel):
    email: EmailStr
    code: str
    new_password: str