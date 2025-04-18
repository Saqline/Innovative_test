from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy import desc, asc
from typing import Optional, Literal

def pay_installment(db: Session, installment_id: int, user_id: int):
    installment = db.query(models.Installment).filter(models.Installment.id == installment_id).first()

    if not installment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Installment not found"
        )
    if installment.is_paid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Installment already paid"
        )

    try:
        # Update installment
        installment.is_paid = True
        installment.status = models.PaymentStatusEnum.paid.value
        installment.paid_date = datetime.utcnow()

        # Update purchase
        purchase = installment.purchase
        purchase.paid_amount += installment.amount
        purchase.due_amount = purchase.total_amount - purchase.paid_amount
        
        if purchase.paid_amount >= purchase.total_amount:
            purchase.status = models.PaymentStatusEnum.paid.value
        
        purchase.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(installment)
        db.refresh(purchase)

        return installment
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process payment"
        )



def get_user_installments(
    db: Session,
    user_id: Optional[int],
    page: int = 1,
    page_size: int = 10,
    status: Optional[str] = None,
    is_paid: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: str = "desc",
    is_admin: bool = False
):
    query = db.query(models.Installment).join(
        models.Purchase,
        models.Installment.purchase_id == models.Purchase.id
    )
    
    if not is_admin:
        query = query.filter(models.Purchase.user_id == user_id)
    elif user_id:  
        query = query.filter(models.Purchase.user_id == user_id)
    
    if status:
        query = query.filter(models.Installment.status == status)
        
    if is_paid is not None:
        query = query.filter(models.Installment.is_paid == is_paid)
    
    # Apply sorting
    valid_sort_columns = {
        "due_date": models.Installment.due_date,
        "amount": models.Installment.amount,
        "is_paid": models.Installment.is_paid,
        "paid_date": models.Installment.paid_date,
        "installment_no": models.Installment.installment_no,
        "status": models.Installment.status
    }
    
    sort_column = valid_sort_columns.get(sort_by, models.Installment.due_date)
    if sort_order == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))
    
    # Apply pagination
    total = query.count()
    installments = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": installments,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

def get_user_installment_stats(db: Session, user_id: int) -> dict:
    # Query all installments for the user
    installments = db.query(models.Installment)\
        .join(models.Purchase)\
        .filter(models.Purchase.user_id == user_id)\
        .all()
    
    # Initialize counters
    stats = {
        "paid": 0,
        "pending": 0,
        "overdue": 0,
        "total": len(installments),
        "total_paid_amount": 0.0,
        "total_pending_amount": 0.0,
        "total_overdue_amount": 0.0
    }
    
    # Calculate stats
    for installment in installments:
        if installment.status == models.PaymentStatusEnum.paid.value:
            stats["paid"] += 1
            stats["total_paid_amount"] += installment.amount
        elif installment.status == models.PaymentStatusEnum.pending.value:
            stats["pending"] += 1
            stats["total_pending_amount"] += installment.amount
        elif installment.status == models.PaymentStatusEnum.overdue.value:
            stats["overdue"] += 1
            stats["total_overdue_amount"] += installment.amount
    
    return stats
