from app.api.schemas.notifications import NotificationResponse, PurchaseNotificationCreate
from app.api.service.notifications import send_purchase_notification
from app.db import models
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.purchases import PurchaseCreate, PurchaseResponse, PurchaseWithInstallmentsResponse
from app.api.service.purchases import create_purchase, get_purchases_with_installments
from app.core.security import get_current_active_user, is_admin
from app.db.models import User, PaymentStatusEnum
from typing import Optional

router = APIRouter()

@router.post("/", response_model=PurchaseResponse)
def create_purchase_endpoint(
    purchase: PurchaseCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
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

@router.post("/{purchase_id}/notify", response_model=NotificationResponse)
def send_purchase_notification_endpoint(
    purchase_id: int,
    notification_data: PurchaseNotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Send notification for a specific purchase with custom message"""
    return send_purchase_notification(
        db=db,
        purchase_id=purchase_id,
        current_user=current_user,
        custom_message=notification_data.message
    )
