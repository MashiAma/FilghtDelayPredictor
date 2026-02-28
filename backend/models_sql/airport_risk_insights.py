from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class AirportRiskInsight(Base):
    __tablename__ = "airport_risk_insights"
    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(50), nullable=True)
    airport = Column(String(50), nullable=True)
    airport_code = Column(String(50), nullable=False)
    generated_date=  Column(DateTime, nullable=False)
    risk_category = Column(String(50), nullable=False)
    risk_level = Column(String(50), nullable=False)
    short_summary = Column(String, nullable=False)
    
