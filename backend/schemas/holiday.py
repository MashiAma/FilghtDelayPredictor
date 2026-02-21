from pydantic import BaseModel, Field,ConfigDict
from datetime import date
from typing import Optional

class HolidayCreate(BaseModel):
    holiday_date: date
    holiday_name: str = Field(..., min_length=1)
    holiday_type: str = Field(..., min_length=1)

class HolidayUpdate(BaseModel):
    holiday_name: Optional[str]
    holiday_type: Optional[str]

class HolidayOut(HolidayCreate):
    id: int
    is_sri_lankan_public_holiday: bool
    is_poya_day: bool
    is_festival_period: bool
    is_post_holiday: bool
    is_long_weekend: bool

    model_config = ConfigDict(from_attributes=True)
