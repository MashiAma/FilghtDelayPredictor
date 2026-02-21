import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.connection import Base, engine, get_db
from main import app
from fastapi.testclient import TestClient
from models_sql.holiday import Holiday
from datetime import date, timedelta
import random
import pytest
from unittest.mock import patch

# PostgreSQL test DB
TEST_DATABASE_URL = "postgresql://postgres:root@127.0.0.1:5432/flightdb_test"


engine = create_engine(TEST_DATABASE_URL )
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables for testing
Base.metadata.create_all(bind=engine)

# ---------------------------
# DB session fixture
# ---------------------------
@pytest.fixture(scope="function")
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.rollback()
        db.close()

# ---------------------------
# Override get_db dependency
# ---------------------------
@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

# ---------------------------
# Mock weather API
# ---------------------------
@pytest.fixture(autouse=True)
def mock_weather(monkeypatch):
    from services.weather_service import get_weather_features
    monkeypatch.setattr(
        get_weather_features,
        "__call__",
        lambda airport_code, dep_dt, prefix: {
            f"{prefix}_has_rain": 0,
            f"{prefix}_has_thunderstorm": 0,
            f"{prefix}_low_visibility": 0,
            f"{prefix}_high_wind": 0,
        }
    )