# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database.connection import get_db
# from schemas.alert import AlertCreate, AlertOut
# from services.alert_service import create_alert, get_user_alerts, mark_alert_as_read

# router = APIRouter()

# # Create an alert
# @router.post("/", response_model=AlertOut)
# def add_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
#     return create_alert(db, alert_in.user_id, alert_in.title, alert_in.message)

# # Get user alerts
# @router.get("/user/{user_id}", response_model=list[AlertOut])
# def list_alerts(user_id: int, db: Session = Depends(get_db)):
#     return get_user_alerts(db, user_id)

# # Mark alert as read
# @router.put("/{alert_id}/read", response_model=AlertOut)
# def read_alert(alert_id: int, db: Session = Depends(get_db)):
#     alert = mark_alert_as_read(db, alert_id)
#     if not alert:
#         raise HTTPException(status_code=404, detail="Alert not found")
#     return alert
