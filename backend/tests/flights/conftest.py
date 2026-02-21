import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.connection import Base, get_db
from main import app
from fastapi.testclient import TestClient
from models_sql.flight import Flight
from datetime import datetime, timedelta

# PostgreSQL test DB URL
TEST_DATABASE_URL = "postgresql://postgres:root@127.0.0.1:5432/flightdb_test"

# Test engine
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_engine():
    Base.metadata.create_all(bind=engine)
    yield engine
    # Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db(db_engine):
    connection = db_engine.connect()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    connection.close()

@pytest.fixture(scope="function")
def client(db):
    def _get_test_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_flight(db):
    flight = Flight(
        flight_number="TEST123",
        departure_airport="CMB",
        arrival_airport="LHE",
        scheduled_departure=datetime.now() + timedelta(days=1),
        scheduled_arrival=datetime.now() + timedelta(days=1, hours=2),
        airline="TestAir",
        status="Scheduled",
        aircraft="B737"
    )
    db.add(flight)
    db.commit()
    db.refresh(flight)
    return flight