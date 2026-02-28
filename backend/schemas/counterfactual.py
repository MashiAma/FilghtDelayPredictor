from pydantic import BaseModel
from typing import Optional, Dict, Any

class CounterfactualRequest(BaseModel):
    baseline_features: Dict[str, Any]
    new_departure_hour: Optional[int] = None
    new_departure_day_offset: Optional[int] = None
    new_airline: Optional[str] = None
    new_route: Optional[str] = None

class CounterfactualResponse(BaseModel):
    baseline_delay_probability: float
    counterfactual_delay_probability: float
    risk_change: float
    risk_change_pct: float
    interpretation: str
    recommendation: str
    changes_applied: Dict[str, Any]
    baseline_class: str
    counterfactual_class: str