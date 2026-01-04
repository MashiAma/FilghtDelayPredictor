from sqlalchemy import Column, Integer, Boolean, Date, String, UniqueConstraint
from database.connection import Base

class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)
    holiday_date = Column(Date, nullable=False, unique=True)
    holiday_name = Column(String, nullable=False)
    holiday_type = Column(String, nullable=False)

    is_sri_lankan_public_holiday = Column(Boolean, default=False)
    is_poya_day = Column(Boolean, default=False)
    is_festival_period = Column(Boolean, default=False)
    is_post_holiday = Column(Boolean, default=False)
    is_long_weekend = Column(Boolean, default=False)

    __table_args__ = (
        UniqueConstraint(
            "holiday_date",
            name="uq_holiday_date"
        ),
    )
