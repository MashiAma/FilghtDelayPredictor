#model_sql/flight.py

from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from database.connection import Base
from sqlalchemy.orm import relationship
from datetime import datetime


class Flight(Base):
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)

    flight_number = Column(String, index=True, nullable=False)
    departure_airport = Column(String, nullable=False,index=True)
    arrival_airport = Column(String, nullable=False,index=True)

    scheduled_departure = Column(DateTime, nullable=False)
    scheduled_arrival = Column(DateTime, nullable=False)

    airline = Column(String, nullable=False)
    status = Column(String, nullable=False)
    aircraft = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint(
            "flight_number",
            "scheduled_departure",
            name="uq_flight_number_departure"
        ),
    )

    predictions = relationship("Prediction", back_populates="flight")
    alerts = relationship("Alert", back_populates="flight", cascade="all, delete-orphan")
