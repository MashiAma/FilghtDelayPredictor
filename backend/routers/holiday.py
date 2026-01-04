from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.holiday import HolidayCreate, HolidayUpdate, HolidayOut
from services.holiday_service import add_holiday, add_holidays_from_csv, update_holiday, get_all_holidays

router = APIRouter()

# Get all holidays
@router.get("/", response_model=list[HolidayOut])
def list_holidays(db: Session = Depends(get_db)):
    return get_all_holidays(db)

# Add single holiday
@router.post("/", response_model=HolidayOut)
def create_holiday(holiday_in: HolidayCreate, db: Session = Depends(get_db)):
    return add_holiday(db, holiday_in)

# Upload CSV
@router.post("/upload-csv")
def upload_holidays(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="CSV file required")
    return add_holidays_from_csv(db, file)

# Update holiday
@router.put("/{holiday_id}", response_model=HolidayOut)
def update_holiday_record(holiday_id: int, holiday_in: HolidayUpdate, db: Session = Depends(get_db)):
    holiday = update_holiday(db, holiday_id, holiday_in)
    if not holiday:
        raise HTTPException(status_code=404, detail="Holiday not found")
    return holiday
