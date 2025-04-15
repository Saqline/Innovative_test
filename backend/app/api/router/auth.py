from app.db import models
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import create_access_token
from app.db.session import get_db
from app.api.schemas.auth import (
    UserCreate,
    UserResponse,
    OTPVerify,
    Token,
    LoginRequest,
    LoginBody,
    ResendOTPRequest,
    ResendOTPResponse
)
from app.api.service.auth import (
    create_user,
    verify_otp,
    authenticate_user,
    send_otp_email,
    resend_otp
)
import random
from datetime import datetime, timedelta

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login-form")

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = create_user(db, user_data)
    # send_otp_email(user.email, user.otp)
    return user

@router.post("/verify-otp", response_model=UserResponse)
def verify_otp_endpoint(otp_data: OTPVerify, db: Session = Depends(get_db)):
    user = verify_otp(db, otp_data.email, otp_data.otp)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    return user

@router.post("/login-form", response_model=Token)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "User": user  # Add the User field to match the Token model
    }

@router.post("/login", response_model=Token)
def login_body(login_data: LoginBody, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is verified
    if not user.is_verified:
        # Generate new OTP and send it
        otp = str(random.randint(100000, 999999))
        otp_expiry = datetime.utcnow() + timedelta(minutes=5)
        
        user.otp = otp
        user.otp_expiry = otp_expiry
        db.commit()
        
        # Send OTP email
        # send_otp_email(user.email, otp)
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": "User not verified",
                "email": user.email,
                "require_verification": True
            }
        )

    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token, 
        "token_type": "Bearer", 
        "User": user
    }

@router.post("/resend-otp", response_model=ResendOTPResponse)
def resend_otp_endpoint(
    request: ResendOTPRequest,
    db: Session = Depends(get_db)
):
    """
    Resend OTP for email verification
    """
    return resend_otp(db, request.email)

