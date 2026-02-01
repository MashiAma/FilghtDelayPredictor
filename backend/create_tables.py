# create_tables.py
# backend/create_tables.py

from database.connection import Base, engine
from models_sql import user, flight, weather, holiday, prediction, alert

def create_all_tables():
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully!")

if __name__ == "__main__":
    create_all_tables()

