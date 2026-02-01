from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Test JWT
print("JWT_SECRET_KEY:", os.getenv("JWT_SECRET_KEY"))
print("JWT_ALGORITHM:", os.getenv("JWT_ALGORITHM"))
print("ACCESS_TOKEN_EXPIRE_MINUTES:", os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# Test Database
print("DB_USER:", os.getenv("DB_USER"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
print("DB_NAME:", os.getenv("DB_NAME"))
print("DB_HOST:", os.getenv("DB_HOST"))
print("DB_PORT:", os.getenv("DB_PORT"))

# Test SMTP
print("SMTP_HOST:", os.getenv("SMTP_HOST"))
print("SMTP_PORT:", os.getenv("SMTP_PORT"))
print("SMTP_USER:", os.getenv("SMTP_USER"))
print("SMTP_PASSWORD:", os.getenv("SMTP_PASSWORD"))
print("SMTP_FROM:", os.getenv("SMTP_FROM"))
