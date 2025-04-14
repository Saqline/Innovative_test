from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.purchases import PurchaseCreate, PurchaseResponse, PurchaseWithInstallmentsResponse
from app.api.service.purchases import create_purchase, get_purchases_with_installments
from app.core.security import get_current_active_user, is_admin
from app.db.models import User

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
    page: int = 1,
    page_size: int = 10,
):
    return get_purchases_with_installments(db, current_user.id, page, page_size)

@router.get("/admin", response_model=list[PurchaseWithInstallmentsResponse])
def read_admin_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(is_admin),
    page: int = 1,
    page_size: int = 10,
):
    return get_purchases_with_installments(db, None, page, page_size)
