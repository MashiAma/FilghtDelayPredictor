from pydantic import BaseModel,validator
from datetime import date, time, datetime
from typing import Optional

class PredictionRequest(BaseModel):
    arrival_airport: str
    flight_number: Optional[str]
    departure_date: date
    departure_time: str

    @validator("departure_time")
    def parse_time(cls, v):
        # remove milliseconds and timezone, keep only HH:MM:SS
        if "T" in v:
            v = v.split("T")[1]
        v = v.split(".")[0]  # remove milliseconds
        return datetime.strptime(v, "%H:%M").time()

# class PredictionCreate(BaseModel):
#     flight_id: int
#     predicted_delay_min: float
#     delay_class: str
#     probability: float

# class PredictionOut(PredictionCreate):
#     id: int
#     created_at: datetime

#     class Config:
#         from_attributes = True  # For SQLAlchemy integration

# class PredictionLatestOut(BaseModel):
#     flight_id: int
#     predicted_delay_min: float
#     delay_class: str
#     probability: float
#     created_at: datetime

#     class Config:
#         from_attributes = True
