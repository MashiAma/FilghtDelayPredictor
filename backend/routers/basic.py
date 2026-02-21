from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.basic import AdminStatsResponse, ChartData
from services.basic_service import (
    get_admin_stats_service,
    get_delay_distribution_service,
    get_delay_by_airline_service,
    get_delay_by_hour_service,
    get_delay_trend_service
)

router = APIRouter()


@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db)):
    return get_admin_stats_service(db)



@router.get("/charts/delay-distribution", response_model=ChartData)
def delay_distribution(db: Session = Depends(get_db)):
    return get_delay_distribution_service(db)


@router.get("/charts/delay-by-airline", response_model=ChartData)
def delay_by_airline(db: Session = Depends(get_db)):
    return get_delay_by_airline_service(db)


@router.get("/charts/delay-by-hour", response_model=ChartData)
def delay_by_hour(db: Session = Depends(get_db)):
    return get_delay_by_hour_service(db)


@router.get("/charts/delay-trend", response_model=ChartData)
def delay_trend(db: Session = Depends(get_db)):
    return get_delay_trend_service(db)
