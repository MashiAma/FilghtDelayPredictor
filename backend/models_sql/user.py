from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default="normal")
    email_alert_opt = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)

    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
