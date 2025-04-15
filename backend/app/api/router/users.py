from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.api.schemas.users import UserResponse
from app.api.service.users import get_current_user, get_customers, delete_user
from app.core.security import get_current_active_user, oauth2_scheme, is_admin
from app.db.models import User, RoleEnum

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
    page: int = Query(1, gt=0),
    page_size: int = Query(10, gt=0, le=100),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    name: Optional[str] = None,
    role: Optional[str] = Query(None, enum=[r.value for r in RoleEnum]),
    current_user: User = Depends(is_admin)
):
    return get_customers(
        db=db,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        name=name,
        role=role
    )

@router.delete("/admin/customers/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(is_admin)
):
    """
    Delete a user by ID. Only accessible by admin users.
    Returns 204 No Content on success.
    """
    delete_user(db, user_id)
    return None
