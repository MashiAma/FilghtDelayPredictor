# backend/tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
import sys
import os

# Ensure imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database.connection import Base, get_db  # Your SQLAlchemy Base and get_db
from main import app  # FastAPI app instance

# PostgreSQL test database URL
TEST_DATABASE_URL = "postgresql://postgres:root@127.0.0.1:5432/flightdb_test"

# Create engine and session factory
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Fixture for test database session
@pytest.fixture(scope="function")
def db():
    # Create all tables before test
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after test
        # Base.metadata.drop_all(bind=engine)

# Fixture for TestClient that uses the test DB
@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()



from models_sql.prediction import Prediction
import uuid
from services.auth_service import create_user

def test_register(client):
    email = f"{uuid.uuid4()}@example.com"
    payload = {
        "full_name": "Test User",
        "email": email,
        "password": "password123"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 200

@pytest.fixture
def test_prediction(db, test_flight, test_user):
    prediction = Prediction(
        flight_id=test_flight.id,
        user_email=test_user.email,
        delay_class_dep="Minor",
        dep_probability=0.5,
        delay_class_arr="On-time",
        arr_probability=0.2,
        predicted_dep_delay_min=15,
        predicted_arr_delay_min=5,
        input_features={"sample": "data"},
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction