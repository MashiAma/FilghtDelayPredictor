from pydantic import BaseModel,field_validator,EmailStr,ConfigDict
from datetime import date, time, datetime
from typing import Optional

class PredictionRequest(BaseModel):
    user_email:EmailStr
    arrival_airport: str
    flight_number: Optional[str]
    departure_date: date
    departure_time: str

    @field_validator("departure_time")
    def parse_time(cls, v):
        # remove milliseconds and timezone, keep only HH:MM:SS
        if "T" in v:
            v = v.split("T")[1]
        v = v.split(".")[0]  # remove milliseconds
        return datetime.strptime(v, "%H:%M").time()

class FlightInfo(BaseModel):
    airline: str
    origin: str
    destination: str
    scheduled_departure: Optional[datetime]
    scheduled_arrival: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

        
class PredictionHistoryOut(BaseModel):
    id: int
    delay_class_dep: str
    dep_probability: float
    created_at: datetime
    flight: FlightInfo

    # class Config:
    #     from_attributes = True
    model_config = ConfigDict(from_attributes=True)


class PredictionHistoryResponse(BaseModel):
    total_predictions: int
    on_time_count: int
    minor_count: int
    major_count: int
    predictions: list[PredictionHistoryOut]
