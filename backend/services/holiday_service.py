from sqlalchemy.orm import Session
from models_sql.holiday import Holiday
from schemas.holiday import HolidayCreate, HolidayUpdate
from fastapi import UploadFile
from io import StringIO
import csv
from datetime import datetime, timedelta

# --- Helper to calculate flags ---
def calculate_holiday_flags(holiday_date, holiday_type, db: Session):
    flags = {
        "is_sri_lankan_public_holiday": holiday_type.lower() == "public",
        "is_festival_period": holiday_type.lower() == "festival",
        "is_poya_day": False,  # can check against Poya calendar if needed
        "is_post_holiday": False,
        "is_long_weekend": False,
    }

    # Post-holiday check
    previous_day = holiday_date - timedelta(days=1)
    prev_holiday = db.query(Holiday).filter(Holiday.holiday_date == previous_day).first()
    if prev_holiday:
        flags["is_post_holiday"] = True

    # Long weekend: Friday (4) or Monday (0)
    weekday = holiday_date.weekday()
    if weekday in [0, 4]:
        flags["is_long_weekend"] = True

    return flags

# --- Single holiday ---
def add_holiday(db: Session, holiday_in: HolidayCreate):
    existing = db.query(Holiday).filter(Holiday.holiday_date == holiday_in.holiday_date).first()
    if existing:
        return existing

    flags = calculate_holiday_flags(holiday_in.holiday_date, holiday_in.holiday_type, db)

    holiday = Holiday(
        holiday_date=holiday_in.holiday_date,
        holiday_name=holiday_in.holiday_name,
        holiday_type=holiday_in.holiday_type,
        **flags
    )
    db.add(holiday)
    db.commit()
    db.refresh(holiday)
    return holiday

# --- Bulk holidays from CSV ---
def add_holidays_from_csv(db: Session, file: UploadFile):
    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(StringIO(content))
    added = 0

    for row in reader:
        holiday_date = datetime.fromisoformat(row["holiday_date"]).date()
        exists = db.query(Holiday).filter(Holiday.holiday_date == holiday_date).first()
        if exists:
            continue

        flags = calculate_holiday_flags(holiday_date, row["holiday_type"], db)

        holiday = Holiday(
            holiday_date=holiday_date,
            holiday_name=row["holiday_name"],
            holiday_type=row["holiday_type"],
            **flags
        )
        db.add(holiday)
        added += 1

    db.commit()
    return {"added_records": added}

# --- Update single holiday ---
def update_holiday(db: Session, holiday_id: int, holiday_in: HolidayUpdate):
    holiday = db.query(Holiday).filter(Holiday.id == holiday_id).first()
    if not holiday:
        return None

    for field, value in holiday_in.model_dump(exclude_unset=True).items():
        setattr(holiday, field, value)

    # Recalculate flags if holiday_type changed
    if "holiday_type" in holiday_in.model_dump(exclude_unset=True):
        flags = calculate_holiday_flags(holiday.holiday_date, holiday.holiday_type, db)
        for key, val in flags.items():
            setattr(holiday, key, val)

    db.commit()
    db.refresh(holiday)
    return holiday

# --- Get all holidays ---
def get_all_holidays(db: Session):
    return db.query(Holiday).all()
