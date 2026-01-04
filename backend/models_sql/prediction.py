from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    flight_id = Column(Integer, ForeignKey("flights.id"), nullable=False)
    predicted_delay_min = Column(Float, nullable=False)
    delay_class = Column(String, nullable=False)  # e.g., "on-time", "short", "long"
    probability = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    flight = relationship("Flight", back_populates="predictions")

# Add this to Flight model in models_sql/flight.py
# predictions = relationship("Prediction", back_populates="flight")
