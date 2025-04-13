from sqlalchemy.orm import Session
from app.db import models
from app.api.schemas.purchases import PurchaseCreate
from datetime import datetime, timedelta
from fastapi import HTTPException, status

def create_purchase(db: Session, purchase: PurchaseCreate, user_id: int):
    product = db.query(models.Product).filter(models.Product.id == purchase.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    total_amount = product.price
    paid_amount = purchase.paid_amount
    due_amount = total_amount - paid_amount

    if paid_amount == total_amount:
        new_purchase = models.Purchase(
            user_id=user_id,
            product_id=purchase.product_id,
            total_amount=total_amount,
            paid_amount=paid_amount,
            due_amount=due_amount,
        )
        db.add(new_purchase)
        db.flush()

        new_installment = models.Installment(
            purchase_id=new_purchase.id,
            installment_no=1,
            amount=paid_amount,
            due_date=datetime.utcnow(),
            is_paid=True,
            paid_date=datetime.utcnow()
        )
        db.add(new_installment)
    elif paid_amount < total_amount:
        new_purchase = models.Purchase(
            user_id=user_id,
            product_id=purchase.product_id,
            total_amount=total_amount,
            paid_amount=paid_amount,
            due_amount=due_amount,
        )
        db.add(new_purchase)
        db.flush()

        new_installment1 = models.Installment(
            purchase_id=new_purchase.id,
            installment_no=1,
            amount=paid_amount,
            due_date=datetime.utcnow(),
            is_paid=True,
            paid_date=datetime.utcnow()
        )
        db.add(new_installment1)

        new_installment2 = models.Installment(
            purchase_id=new_purchase.id,
            installment_no=2,
            amount=due_amount,
            due_date=datetime.utcnow() + timedelta(days=30),
            is_paid=False,
            paid_date=None
        )
        db.add(new_installment2)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paid amount cannot be greater than total amount"
        )

    db.commit()
    db.refresh(new_purchase)
    return new_purchase

def get_purchases_with_installments(db: Session, user_id: int = None, page: int = 1, page_size: int = 10):
    query = db.query(models.Purchase)

    if user_id:
        query = query.filter(models.Purchase.user_id == user_id)

    total = query.count()
    query = query.offset((page - 1) * page_size).limit(page_size)
    purchases = query.all()

    from app.api.schemas.purchases import PurchaseWithInstallmentsResponse
    # Load associated installments for each purchase
    purchases_with_installments = []
    for purchase in purchases:
        installments = db.query(models.Installment).filter(models.Installment.purchase_id == purchase.id).all()
        purchases_with_installments.append(
            PurchaseWithInstallmentsResponse(
                id=purchase.id,
                user_id=purchase.user_id,
                product_id=purchase.product_id,
                total_amount=purchase.total_amount,
                paid_amount=purchase.paid_amount,
                due_amount=purchase.due_amount,
                created_at=purchase.created_at,
                installments=installments,
            )
        )

    return purchases_with_installments
