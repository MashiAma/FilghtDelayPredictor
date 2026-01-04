from pydantic import BaseModel, EmailStr

# --- For creating a new user ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str | None = None

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
    email_alert_opt: bool
    is_active: bool

    class Config:
        from_attributes = True  # pydantic v2 replacement for orm_mode

# --- Update profile ---
class UpdateProfile(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    email_alert_opt: bool | None = None

# --- Change password ---
class ChangePassword(BaseModel):
    old_password: str
    new_password: str

# --- Reset password ---
class ResetPassword(BaseModel):
    email: EmailStr
    new_password: str
