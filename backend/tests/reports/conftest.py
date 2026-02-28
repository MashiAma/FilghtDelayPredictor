import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.connection import Base, get_db
from fastapi.testclient import TestClient
from main import app
from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from models_sql.user import User
from models_sql.flight import Flight
from models_sql.prediction import Prediction
from datetime import datetime, timedelta, timezone
import time

# Use a separate test DB
TEST_DATABASE_URL = "postgresql://postgres:root@127.0.0.1:5432/flightdb_test"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def setup_test_data(db: Session):
    """
    Creates test users, flights, and predictions.
    Ensures unique emails and proper relationships.
    """
    # Create unique user
    user_email = f"user_{datetime.now(timezone.utc).timestamp()}@test.com"
    test_user = User(
        email=user_email,
        full_name="Test User",
        hashed_password="test",  # or hashed if your User model expects hashed
        role="normal",
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)

    # Create flight
    scheduled_departure = datetime.now(timezone.utc) + timedelta(days=1)
    scheduled_arrival = scheduled_departure + timedelta(hours=2)
    flight_number = f"TEST{int(time.time())}"  # e.g., TEST1700000000
    test_flight = Flight(
        flight_number=flight_number,
        airline="TestAir",
        aircraft="TestAircraft",
        departure_airport="CMB",
        arrival_airport="KUL",
        scheduled_departure=scheduled_departure,
        scheduled_arrival=scheduled_arrival,
        status="Scheduled",
    )
    db.add(test_flight)
    db.commit()
    db.refresh(test_flight)

    # Create prediction linked to flight and user
    test_prediction = Prediction(
        flight_id=test_flight.id,
        user_email=test_user.email,
        delay_class_dep="On-time",
        dep_probability=0.1,
        input_features={"sample_feature": 1},
        created_at=datetime.now(timezone.utc)
    )
    db.add(test_prediction)
    db.commit()
    db.refresh(test_prediction)

    yield {
        "user": test_user,
        "flight": test_flight,
        "prediction": test_prediction,
    }

    # Cleanup after test
    db.delete(test_prediction)
    db.delete(test_flight)
    db.delete(test_user)
    db.commit()