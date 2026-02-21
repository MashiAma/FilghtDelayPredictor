from datetime import date, timedelta
from schemas.holiday import HolidayCreate, HolidayUpdate
from services.holiday_service import add_holiday, update_holiday, get_all_holidays
import random 

def test_add_holiday(db):
    holiday_in = HolidayCreate(
        holiday_date=date.today() + timedelta(days=random.randint(1, 1000)),  # unique
        holiday_name="New Year Test",
        holiday_type="Public"
    )
    holiday = add_holiday(db, holiday_in)
    assert holiday.id is not None
    assert holiday.is_sri_lankan_public_holiday is True

def test_update_holiday(db, test_holiday):
    update_in = HolidayUpdate(
        holiday_name="Updated Holiday Name",
        holiday_type="Public"  # required to pass Pydantic validation
    )
    updated = update_holiday(db, test_holiday.id, update_in)
    assert updated.holiday_name == "Updated Holiday Name"

def test_get_all_holidays(db, test_holiday):
    holidays = get_all_holidays(db)
    assert len(holidays) >= 1
    assert any(h.id == test_holiday.id for h in holidays)