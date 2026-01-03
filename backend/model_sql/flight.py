from sqlalchemy import Column, Integer, String, Float
from database.db import Base

class Flight(Base):
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    airline = Column(String)
    origin = Column(String)
    destination = Column(String)
    scheduled_departure_hour = Column(Integer)
    scheduled_arrival_hour = Column(Integer)
    departure_delay_min = Column(Float)
    arrival_delay_min = Column(Float)
    # Add other fields you need from your CSV
