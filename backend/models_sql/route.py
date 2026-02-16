from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON, Boolean
from database.connection import Base

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, nullable=False)
    avg_delay = Column(Float, nullable=False, default=0)
    delay_rate = Column(Float, nullable=False, default=0)
    is_short_haul = Column(Boolean, nullable=False, default=False)
    distance = Column(Float, nullable=False, default=0)
