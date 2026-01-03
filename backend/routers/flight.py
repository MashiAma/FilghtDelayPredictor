from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models_sql.flight import Flight

router = APIRouter(prefix="/flights", tags=["flights"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all_flights(db: Session = Depends(get_db)):
    flights = db.query(Flight).all()
    return flights

# Later add /predict, /explain, /recommend endpoints
