from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from schemas.basic import (
    AdminStatsResponse,
    ChartData,
    LastPredictionsResponse,
    HolidayResponse
)
from services.basic_service import (
    get_admin_stats_service,
    get_user_role_distribution_service,
    get_delay_distribution_service,
    get_last_10_predictions_service,
    get_current_month_holidays_service
)

from services.basic_service import get_tomorrow_flights_service
router = APIRouter()


@router.get("/stats", response_model=AdminStatsResponse)
def get_stats(db: Session = Depends(get_db)):
    return get_admin_stats_service(db)


@router.get("/charts/user-roles", response_model=ChartData)
def user_roles_chart(db: Session = Depends(get_db)):
    return get_user_role_distribution_service(db)


@router.get("/charts/delay-distribution", response_model=ChartData)
def delay_distribution(db: Session = Depends(get_db)):
    return get_delay_distribution_service(db)


@router.get("/last-10", response_model=LastPredictionsResponse)
def last_10_predictions(db: Session = Depends(get_db)):
    return get_last_10_predictions_service(db)


@router.get("/holidays", response_model=HolidayResponse)
def current_month_holidays(db: Session = Depends(get_db)):
    return get_current_month_holidays_service(db)

@router.get("/tomorrow-flights")
def get_tomorrow_flights(db: Session = Depends(get_db)):
    """
    Return all flights scheduled for tomorrow.
    """
    return get_tomorrow_flights_service(db)