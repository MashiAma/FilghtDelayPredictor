from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ========================
# KPI RESPONSE
# ========================

class AdminStatsResponse(BaseModel):
    total_users: int
    total_predictions: int
    predictions_this_month: int
    high_risk_percentage: float
    flights_this_month:int
    average_probability: float


# ========================
# GENERIC CHART
# ========================

class ChartData(BaseModel):
    labels: List[str]
    values: List[float]


# ========================
# LAST 10 PREDICTIONS
# ========================

class LastPredictionItem(BaseModel):
    user_email:str
    route: str
    probability: float
    risk_level: str
    created_at: datetime


class LastPredictionsResponse(BaseModel):
    total: int
    predictions: List[LastPredictionItem]


# ========================
# HOLIDAY RESPONSE
# ========================

class HolidayItem(BaseModel):
    name: str
    date: datetime
    type: str


class HolidayResponse(BaseModel):
    holidays: List[HolidayItem]