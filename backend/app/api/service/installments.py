from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime
from fastapi import HTTPException, status

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

from typing import Optional

from sqlalchemy import asc, desc

def get_user_installments(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 10,
    is_admin: bool = False,
    is_paid: Optional[bool] = None,
    sort_by: str = "due_date",
    sort_order: str = "desc",
):
    query = db.query(models.Installment)

    if not is_admin:
        query = query.join(models.Purchase).filter(models.Purchase.user_id == user_id)

    if is_paid is not None:
        query = query.filter(models.Installment.is_paid == is_paid)

    if sort_order == "asc":
        order = asc(sort_by)
    else:
        order = desc(sort_by)

    query = query.order_by(order)

    total = query.count()
    query = query.offset((page - 1) * page_size).limit(page_size)
    installments = query.all()

    return installments
