from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from database.connection import Base

class Airline(Base):
    __tablename__ = "airlines"

    id = Column(Integer, primary_key=True, index=True)
    airline = Column(String, nullable=False)
    avg_delay = Column(Float, nullable=False, default=0)
    delay_rate = Column(Float, nullable=False, default=0)
