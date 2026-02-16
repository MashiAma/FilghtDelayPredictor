from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from database.connection import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    flight_id = Column(Integer, ForeignKey("flights.id"), nullable=False)
    user_email = Column(String, ForeignKey("users.email"))
    delay_class_dep = Column(String, nullable=False)
    dep_probability = Column(Float, nullable=False)
    delay_class_arr = Column(String)
    arr_probability = Column(Float, nullable=False)
    predicted_dep_delay_min = Column(Float)
    predicted_arr_delay_min = Column(Float)
    input_features = Column(JSON) # Store all input features as JSON
    created_at = Column(DateTime, default=datetime.utcnow)

    flight = relationship("Flight", back_populates="predictions")
