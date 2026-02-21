#schemas/flight.py

from pydantic import BaseModel, Field,ConfigDict
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
    scheduled_departure: Optional[datetime] = None
    scheduled_arrival: Optional[datetime] = None
    status: Optional[str]= None
    aircraft: Optional[str]= None

class DepartureTimeOut(BaseModel):
    scheduled_departure: datetime
    departure_time: str 
    arrival_airport: str
    airline:str
    flight_number:str

class FlightOut(FlightCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
