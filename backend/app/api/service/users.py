from app.db import models
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.api.schemas.users import UserResponse
from sqlalchemy import asc, desc
from app.db import models
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

def get_current_user(db: Session, email: str) -> UserResponse:
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

def get_customers(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    sort_by: str = "created_at",
    sort_order: str = "asc",
    name: Optional[str] = None,
    role: Optional[str] = None,
):
    query = db.query(models.User)

    # Apply filters
    if name:
        query = query.filter(models.User.name.ilike(f"%{name}%"))
    
    if role:
        query = query.filter(models.User.role == role)

    # Apply sorting
    if sort_order == "asc":
        order = asc(getattr(models.User, sort_by))
    else:
        order = desc(getattr(models.User, sort_by))

    query = query.order_by(order)

    # Apply pagination
    total = query.count()
    query = query.offset((page - 1) * page_size).limit(page_size)
    customers = query.all()

    return customers

def delete_user(db: Session, user_id: int) -> None:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deletion of admin users
    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete admin users"
        )
    
    # Check if user has any purchases
    if user.purchases:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete user with existing purchases"
        )
    
    # Delete associated notifications first
    db.query(models.Notification).filter(models.Notification.user_id == user_id).delete()
    
    # Now delete the user
    db.delete(user)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user. Please try again."
        )
