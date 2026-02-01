from sqlalchemy import Column, Integer, String
from database.connection import Base

class PasswordResetCode(Base):
    __tablename__ = "password_reset_codes"

    id = Column(Integer, primary_key=True)
    email = Column(String(100), index=True)
    code = Column(String(6))
