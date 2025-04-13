from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db import models
from app.core.security import get_password_hash, verify_password
from app.core.email_utils import send_email
import random

def create_user(db: Session, user_data):
    # Generate OTP with 5 minute expiry
    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.utcnow() + timedelta(minutes=5)
    
    db_user = models.User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=user_data.password,
        otp=otp,
        otp_expiry=otp_expiry,
        is_active=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_otp(db: Session, email: str, otp: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or user.otp != otp or datetime.utcnow() > user.otp_expiry:
        return None
    
    user.is_active = True
    user.is_verified = True
    user.otp = None
    db.commit()
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    if not user.is_active or not user.is_verified:
        return None
    return user

def send_otp_email(email: str, otp: str):
    subject = "Your Verification Code"
    message = f"Your OTP code is: {otp}"
    send_email(email, subject, message)
