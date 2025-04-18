from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db import models
from app.core.security import get_password_hash, verify_password
from app.core.email_utils import send_email
import random
from fastapi import HTTPException, status

def create_user(db: Session, user_data):
    # Generate OTP with 5 minute expiry
    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.utcnow() + timedelta(minutes=5)
    
    # Hash the password before storing
    hashed_password = get_password_hash(user_data.password)
    
    db_user = models.User(
        email=user_data.email,
        name=user_data.name,
        phone_number=user_data.phone_number,
        hashed_password=hashed_password,  
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
        return user
    return user

def send_otp_email(email: str, otp: str):
    subject = "Your Verification Code"
    message = f"Your OTP code is: {otp}"
    send_email(email, subject, message)

def resend_otp(db: Session, email: str) -> dict:
    """
    Resend OTP for user verification
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not registered"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )

    # Generate new OTP
    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.utcnow() + timedelta(minutes=5)
    
    # Update user with new OTP
    user.otp = otp
    user.otp_expiry = otp_expiry
    db.commit()
    
    # Send OTP email
    send_otp_email(user.email, otp)
    
    return {
        "email": user.email,
        "message": "OTP has been resent successfully"
    }

def initiate_password_reset(db: Session, email: str) -> dict:
    """
    Initiate the password reset process by sending OTP
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not registered"
        )

    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.utcnow() + timedelta(minutes=5)
    
    user.otp = otp
    user.otp_expiry = otp_expiry
    db.commit()
    
    subject = "Password Reset Request"
    message = f"Your password reset OTP is: {otp}. This code will expire in 5 minutes."
    send_email(user.email, subject, message)
    
    return {
        "message": "Password reset OTP has been sent to your email",
        "email": user.email
    }

def reset_password(db: Session, email: str, otp: str, new_password: str) -> dict:
    """
    Reset user password using OTP
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not registered"
        )

    if not user.otp or user.otp != otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    if datetime.utcnow() > user.otp_expiry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )

    user.hashed_password = get_password_hash(new_password)
    user.otp = None  
    user.otp_expiry = None
    db.commit()

    return {"message": "Password has been reset successfully"}
