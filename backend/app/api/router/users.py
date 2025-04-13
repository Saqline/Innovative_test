from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.users import UserResponse
from app.api.service.users import get_current_user, get_customers
from app.core.security import get_current_active_user, oauth2_scheme, is_admin
from app.db.models import User
from typing import Optional
from sqlalchemy import asc, desc

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return get_current_user(db, current_user)

@router.get("/admin/customers", response_model=list[UserResponse])
def read_customers(
    db: Session = Depends(get_db),
    page: int = 1,
    page_size: int = 10,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    name: Optional[str] = None,
    current_user: bool = Depends(is_admin),
):
    return get_customers(db, page, page_size, sort_by, sort_order, name)
