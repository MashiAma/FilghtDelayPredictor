from fastapi import FastAPI
from routers import auth,alert, admin, ai_chat, flight, prediction, holiday
from models_sql.user import User
from models_sql.alert import Alert
from models_sql.flight import Flight

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Flight Delay Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # For development, allow React app on localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
# app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(ai_chat.router, prefix="/ai_chat", tags=["AI Chat"])
app.include_router(flight.router, prefix="/flights", tags=["Flights"])
app.include_router(alert.router, prefix="/alerts", tags=["Alerts"])
app.include_router(prediction.router, prefix="/predictions", tags=["Predictions"])
app.include_router(holiday.router, prefix="/holidays", tags=["Holidays"])

