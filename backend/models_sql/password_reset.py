from sqlalchemy import Column, Integer, String, DateTime
from database.connection import Base
from datetime import datetime

class PasswordResetCode(Base):
    __tablename__ = "password_reset_codes"

    id = Column(Integer, primary_key=True)
    email = Column(String(100), index=True)
    code = Column(String(6))
    created_at = Column(DateTime, default=datetime.utcnow)
