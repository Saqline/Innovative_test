import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    EMAIL_HOST = "smtp.gmail.com"
    EMAIL_PORT = 587
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 100

settings = Settings()
