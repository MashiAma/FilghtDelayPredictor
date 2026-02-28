from sqlalchemy.orm import Session
# from models_sql.user import User
from models_sql.airport_risk_insights import AirportRiskInsight
from sqlalchemy import create_engine, desc, cast, DateTime, func
from passlib.context import CryptContext

# def get_user_by_email(db: Session, email: str):
#     return db.query(User).filter(User.email == email).first()


def get_airport_risk_insight(db: Session, airport_code: str):
    print("Callingt function risk insights")
    insight = db.query(AirportRiskInsight)\
            .filter(AirportRiskInsight.airport_code == airport_code)\
            .order_by(
                # Cast the string column to TIMESTAMP WITH TIME ZONE then sort DESC
                desc(cast(AirportRiskInsight.generated_date, DateTime(timezone=False)))
            )\
            .first()

    print(insight)
    return insight


