from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.purchases import PurchaseCreate, PurchaseResponse, PurchaseWithInstallmentsResponse
from app.api.service.purchases import create_purchase, get_purchases_with_installments
from app.core.security import get_current_active_user, is_admin
from app.db.models import User, PaymentStatusEnum
from typing import Optional

router = APIRouter()

@router.post("/", response_model=PurchaseResponse, status_code=status.HTTP_201_CREATED)
def create_new_purchase(
    purchase: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return create_purchase(db, purchase, current_user.id)

@router.get("/me", response_model=list[PurchaseWithInstallmentsResponse])
def read_user_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    page: int = Query(1, gt=0),
    page_size: int = Query(10, gt=0, le=100),
    status: Optional[str] = Query(None, enum=[s.value for s in PaymentStatusEnum]),
):
    return get_purchases_with_installments(
        db=db,
        user_id=current_user.id,
        page=page,
        page_size=page_size,
        status=status
    )

@router.get("/admin", response_model=list[PurchaseWithInstallmentsResponse])
def read_admin_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(is_admin),
    page: int = Query(1, gt=0),
    page_size: int = Query(10, gt=0, le=100),
    status: Optional[str] = Query(None, enum=[s.value for s in PaymentStatusEnum]),
    user_id: Optional[int] = None,
):
    return get_purchases_with_installments(
        db=db,
        user_id=user_id,
        page=page,
        page_size=page_size,
        status=status
    )
