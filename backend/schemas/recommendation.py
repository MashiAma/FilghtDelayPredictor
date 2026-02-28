from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class RecommendationRequest(BaseModel):
    airline: str
    origin_code: str
    destination_code: str
    target_date: date

class TimeSlot(BaseModel):
    hour: int
    label: str
    estimated_delay_risk: float
    recommendation: str

class RecommendationResponse(BaseModel):
    best_departure_hour: int
    best_departure_label: str
    best_day_of_week: str
    best_airline: Optional[str] = None
    time_slots: List[TimeSlot]
    summary: str