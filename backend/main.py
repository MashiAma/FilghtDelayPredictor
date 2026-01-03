from fastapi import FastAPI
from routers import auth, flight
from database.db import Base, engine

# Create tables in PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flight Delay Predictor")

# Include routers
app.include_router(auth.router)
app.include_router(flight.router)

@app.get("/")
def root():
    return {"message": "Backend running with PostgreSQL, Auth & Flight API"}
