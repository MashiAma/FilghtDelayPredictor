from sqlalchemy.orm import Session
from models_sql.holiday import Holiday
from schemas.holiday import HolidayCreate, HolidayUpdate
from fastapi import UploadFile
from fastapi import HTTPException
from io import StringIO
import csv
from datetime import datetime, timedelta , date
REQUIRED_COLUMNS = {"holiday_date", "holiday_name", "holiday_type"}

# --- Helper to calculate flags ---
def calculate_holiday_flags(holiday_date, holiday_name, holiday_type, db: Session):
    holiday_name_lower = holiday_name.lower()
    festival_months = [4, 5, 6, 7, 8, 12]
    flags = {
        "is_sri_lankan_public_holiday": holiday_type.lower() == "public",
        "is_festival_period": holiday_date.month in festival_months,
        "is_poya_day": any(keyword in holiday_name_lower for keyword in ["poya", "full moon", "moon"]),
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
    if weekday == 4 or weekday == 0:  # Friday or Monday
        flags["is_long_weekend"] = True

    return flags

# --- Single holiday ---
def add_holiday(db: Session, holiday_in: HolidayCreate):
    existing = db.query(Holiday).filter(Holiday.holiday_date == holiday_in.holiday_date).first()
    if existing:
        return existing

    flags = calculate_holiday_flags(holiday_in.holiday_date, holiday_in.holiday_name, holiday_in.holiday_type, db)

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
def add_holidays_from_csv(db: Session, file):
    content = file.file.read().decode("utf-8-sig")  # handle BOM
    reader = csv.DictReader(StringIO(content))

    # Normalize headers
    reader.fieldnames = [h.strip() for h in reader.fieldnames]
    print("CSV headers detected:", reader.fieldnames)

    added = 0
    errors = []  # collect row-level errors

    REQUIRED_COLS = ["holiday_date", "holiday_name", "holiday_type"]

    for i, row in enumerate(reader, start=2):  # row 1 = header
        # Normalize row values
        row = {
            k.strip(): v.strip() if isinstance(v, str) else v
            for k, v in row.items()
        }

        # ---- Required column validation ----
        missing_cols = [col for col in REQUIRED_COLS if not row.get(col)]
        if missing_cols:
            errors.append({
                "row": i,
                "error": f"Missing required columns: {', '.join(missing_cols)}",
                "row_data": row
            })
            continue

        # ---- Date parsing (M/D/YYYY) ----
        try:
            holiday_date = datetime.strptime(
                row["holiday_date"],
                "%m/%d/%Y"
            ).date()
        except ValueError:
            errors.append({
                "row": i,
                "error": f"Invalid date format (expected M/D/YYYY): {row['holiday_date']}",
                "row_data": row
            })
            continue

        # ---- Duplicate check ----
        exists = db.query(Holiday).filter(
            Holiday.holiday_date == holiday_date
        ).first()
        if exists:
            errors.append({
                "row": i,
                "error": "Duplicate holiday record",
                "row_data": row
            })
            continue

        # ---- Derived flags ----
        try:
            flags = calculate_holiday_flags(
                holiday_date,
                row["holiday_name"],
                row["holiday_type"],
                db
            )
        except Exception as e:
            errors.append({
                "row": i,
                "error": f"Failed to calculate holiday flags: {str(e)}",
                "row_data": row
            })
            continue

        # ---- Save ----
        holiday = Holiday(
            holiday_date=holiday_date,          # stored as ISO by DB
            holiday_name=row["holiday_name"],
            holiday_type=row["holiday_type"],
            **flags
        )

        db.add(holiday)
        added += 1

    db.commit()

    return {
        "added_records": added,
        "errors": errors
    }


# --- Update single holiday ---
def update_holiday(db: Session, holiday_id: int, holiday_in: HolidayUpdate):
    holiday = db.query(Holiday).filter(Holiday.id == holiday_id).first()
    if not holiday:
        return None

    for field, value in holiday_in.model_dump(exclude_unset=True).items():
        setattr(holiday, field, value)

    # Recalculate flags if holiday_type changed
    if "holiday_type" in holiday_in.model_dump(exclude_unset=True):
        flags = calculate_holiday_flags(holiday.holiday_date, holiday.holiday_name, holiday.holiday_type, db)
        for key, val in flags.items():
            setattr(holiday, key, val)

    db.commit()
    db.refresh(holiday)
    return holiday

# --- Get all holidays ---
def get_all_holidays(db: Session):
    return db.query(Holiday).all()

def get_holiday_features(db: Session, dep_date: date) -> dict:
    holiday = db.query(Holiday).filter(
        Holiday.holiday_date == dep_date
    ).first()

    if not holiday:
        return {
            "is_sri_lankan_public_holiday": 0,
            "is_poya_day": 0,
            "is_festival_period": 0,
            "is_post_holiday": 0,
            "is_long_weekend": 0,
        }

    return {
        "is_sri_lankan_public_holiday": int(holiday.is_sri_lankan_public_holiday),
        "is_poya_day": int(holiday.is_poya_day),
        "is_festival_period": int(holiday.is_festival_period),
        "is_post_holiday": int(holiday.is_post_holiday),
        "is_long_weekend": int(holiday.is_long_weekend),
    }
