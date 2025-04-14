from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.installments import InstallmentResponse
from app.api.service.installments import pay_installment, get_user_installments
from app.core.security import get_current_active_user, is_admin
from app.db.models import User
from typing import Optional
from pydantic import BaseModel

class InstallmentListResponse(BaseModel):
    items: list[InstallmentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

router = APIRouter()

@router.patch("/{installment_id}/pay", response_model=InstallmentResponse)
def pay_existing_installment(
    installment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return pay_installment(db, installment_id, current_user.id)

@router.get("/me", response_model=InstallmentListResponse)
def read_user_installments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    page: int = 1,
    page_size: int = 10,
    is_paid: Optional[bool] = None,
    sort_by: str = "due_date",
    sort_order: str = "desc",
):
    return get_user_installments(db, current_user.id, page, page_size, is_paid=is_paid, sort_by=sort_by, sort_order=sort_order)

@router.get("/admin", response_model=list[InstallmentResponse])
def read_admin_installments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    page: int = 1,
    page_size: int = 10,
    is_paid: Optional[bool] = None,
    sort_by: str = "id",
    sort_order: str = "desc",
):
    user = db.query(User).filter(User.id == current_user.id).first()
    return get_user_installments(db, user.id, page, page_size, is_admin=True, is_paid=is_paid, sort_by=sort_by, sort_order=sort_order)
