from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.installments import InstallmentResponse
from app.api.service.installments import pay_installment, get_user_installments, get_user_installment_stats
from app.core.security import get_current_active_user, is_admin
from app.db.models import User, PaymentStatusEnum
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
    page: int = Query(1, gt=0),
    page_size: int = Query(10, gt=0, le=100),
    status: Optional[str] = Query(None, enum=[s.value for s in PaymentStatusEnum]),
    is_paid: Optional[bool] = None,
    sort_by: str = "due_date",
    sort_order: str = "desc",
):
    return get_user_installments(
        db=db,
        user_id=current_user.id,
        page=page,
        page_size=page_size,
        status=status,
        is_paid=is_paid,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/admin", response_model=InstallmentListResponse)
def read_admin_installments(
    db: Session = Depends(get_db),
    current_user: User = Depends(is_admin),
    page: int = Query(1, gt=0),
    page_size: int = Query(10, gt=0, le=100),
    status: Optional[str] = Query(None, enum=[s.value for s in PaymentStatusEnum]),
    is_paid: Optional[bool] = None,
    user_id: Optional[int] = None,
    sort_by: str = "due_date",
    sort_order: str = "desc",
):
    return get_user_installments(
        db=db,
        user_id=user_id,
        page=page,
        page_size=page_size,
        status=status,
        is_paid=is_paid,
        sort_by=sort_by,
        sort_order=sort_order,
        is_admin=True
    )

@router.get("/stats", response_model=dict)
def get_installment_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get installment statistics for the current user"""
    return get_user_installment_stats(db, current_user.id)
