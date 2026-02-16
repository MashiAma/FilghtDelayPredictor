from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from database.connection import Base

class Aircraft(Base):
    __tablename__ = "aircrafts"

    id = Column(Integer, primary_key=True, index=True)
    aircraft = Column(String, nullable=False)
    avg_delay = Column(Float, nullable=False, default=0)
