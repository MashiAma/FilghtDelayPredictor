#schemas/flight.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class FlightCreate(BaseModel):
    flight_number: str = Field(..., min_length=1)
    departure_airport: str = Field(..., min_length=1, max_length=60)
    arrival_airport: str = Field(..., min_length=1, max_length=60)
    scheduled_departure: datetime
    scheduled_arrival: datetime
    airline: str
    status: str
    aircraft: str

class FlightUpdate(BaseModel):
    scheduled_departure: Optional[datetime]
    scheduled_arrival: Optional[datetime]
    status: Optional[str]
    aircraft: Optional[str]

class DepartureTimeOut(BaseModel):
    scheduled_departure: datetime
    departure_time: str 
    arrival_airport: str
    airline:str
    flight_number:str

class FlightOut(FlightCreate):
    id: int

    class Config:
        from_attributes = True


# class PredictionOut(BaseModel):
#     flight_id: int
#     predicted_delay_min: float
#     delay_class: str
#     probability: float
#     created_at: datetime
