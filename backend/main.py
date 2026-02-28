from fastapi import FastAPI
from routers import auth, basic, ai_explanation, flight, prediction, holiday, report
from models_sql.user import User
from models_sql.alert import Alert
from models_sql.flight import Flight
from database.connection import Base, engine  # Make sure this exists
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Flight Delay Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(basic.router, prefix="/basic", tags=["Basic"])
app.include_router(ai_explanation.router, prefix="/ai-explanation", tags=["AI Explanation"])
app.include_router(flight.router, prefix="/flights", tags=["Flights"])
# app.include_router(alert.router, prefix="/alerts", tags=["Alerts"])
app.include_router(report.router, prefix="/report", tags=["Report"])
app.include_router(prediction.router, prefix="/predictions", tags=["Predictions"])
app.include_router(holiday.router, prefix="/holidays", tags=["Holidays"])
