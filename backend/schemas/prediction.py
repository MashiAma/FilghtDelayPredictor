from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionCreate(BaseModel):
    flight_id: int
    predicted_delay_min: float
    delay_class: str
    probability: float

class PredictionOut(PredictionCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # For SQLAlchemy integration

class PredictionLatestOut(BaseModel):
    flight_id: int
    predicted_delay_min: float
    delay_class: str
    probability: float
    created_at: datetime

    class Config:
        from_attributes = True
