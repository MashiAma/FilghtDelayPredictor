# tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.connection import Base, get_db
from main import app
from fastapi.testclient import TestClient

TEST_DATABASE_URL = "postgresql://postgres:root@127.0.0.1:5432/flightdb_test"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def db():
    connection = engine.connect()
    # transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    # transaction.rollback()
    connection.close()

@pytest.fixture(scope="module")
def client():
    return TestClient(app)