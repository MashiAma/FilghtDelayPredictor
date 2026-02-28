from pydantic import BaseModel
from typing import Dict, Any

class NarrativeRequest(BaseModel):
    flight_id: int
    dep_probability: float
    delay_class_dep: str
    features: Dict[str, Any]

class NarrativeResponse(BaseModel):
    narrative: str
    reason_breakdown: Dict[str, str]
    confidence_explanation: str
    passenger_impact: str