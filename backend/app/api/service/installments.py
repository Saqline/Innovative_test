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

    purchase = db.query(models.Purchase).filter(models.Purchase.id == installment.purchase_id).first()

    if not purchase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase not found"
        )

    if purchase.paid_amount == purchase.total_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Purchase is already fully paid"
        )

    if purchase.user_id != user_id:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user or user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to pay this installment"
            )

    if installment.is_paid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Installment is already paid"
        )

    installment.is_paid = True
    installment.paid_date = datetime.utcnow()
    db.commit()
    db.refresh(installment)

    purchase.paid_amount = purchase.total_amount
    purchase.due_amount = 0
    purchase.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(purchase)

    return installment



def get_user_installments(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 10,
    is_paid: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: Literal["asc", "desc"] = "desc"
):
    """
    Get user installments with filtering and sorting
    """
    query = db.query(models.Installment).join(
        models.Purchase,
        models.Installment.purchase_id == models.Purchase.id
    ).filter(models.Purchase.user_id == user_id)
    
    if is_paid is not None:
        query = query.filter(models.Installment.is_paid == is_paid)
    
    valid_sort_columns = {
        "due_date": models.Installment.due_date,
        "amount": models.Installment.amount,
        "is_paid": models.Installment.is_paid,
        "paid_date": models.Installment.paid_date,
        "installment_no": models.Installment.installment_no
    }
    
    if sort_by and sort_by in valid_sort_columns:
        sort_column = valid_sort_columns[sort_by]
        if sort_order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(models.Installment.due_date))
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    installments = query.all()
    
    return {
        "items": installments,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }
