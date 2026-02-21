from pydantic import BaseModel,ConfigDict
from typing import List, Optional


class AdminStatsResponse(BaseModel):
    total_flights_current_month: int
    total_predictions_current_month: int
    total_users: int
    average_departure_delay: float
    delay_rate_percent: float
    most_delayed_airline: Optional[str]


class ChartData(BaseModel):
    labels: List[str]
    values: List[float]
