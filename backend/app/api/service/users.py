from app.db import models
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.api.schemas.users import UserResponse
from sqlalchemy import asc, desc
from app.db import models
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

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
    name: str = None,
):
    query = db.query(models.User)

    if name:
        query = query.filter(models.User.name.ilike(f"%{name}%"))

    if sort_order == "asc":
        order = asc(sort_by)
    else:
        order = desc(sort_by)

    query = query.order_by(order)

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
    
    db.delete(user)
    db.commit()
