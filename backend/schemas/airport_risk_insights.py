from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


# --- For getting insight in ---
class InsightGet(BaseModel):
    airport_code: str
    risk_category: str
    risk_level: str
    short_summary: str
    


