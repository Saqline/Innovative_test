from sqlalchemy.orm import Session
from app.db import models
from app.api.schemas.purchases import PurchaseCreate
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy import update
from decimal import Decimal

def create_purchase(db: Session, purchase: PurchaseCreate, user_id: int):
    """Create a new purchase with installments"""
    
    # Get product and check stock
    product = db.query(models.Product).filter(models.Product.id == purchase.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if enough stock is available
    if product.stock < purchase.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Available: {product.stock}, Requested: {purchase.quantity}"
        )

    # Calculate total amount based on quantity and validate paid amount
    total_amount = Decimal(str(product.price)) * Decimal(str(purchase.quantity))
    total_amount = float(total_amount)
    paid_amount = float(Decimal(str(purchase.paid_amount)))
    
    # Validate paid amount
    if paid_amount > total_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paid amount cannot be greater than total amount"
        )

    if paid_amount < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paid amount cannot be negative"
        )

    due_amount = total_amount - paid_amount
    number_of_installments = 2 if due_amount > 0 else 1

    # Start transaction
    try:
        # Create purchase record
        new_purchase = models.Purchase(
            user_id=user_id,
            product_id=purchase.product_id,
            quantity=purchase.quantity,
            total_amount=total_amount,
            paid_amount=paid_amount,
            due_amount=due_amount,
            number_of_installments=number_of_installments,
            created_at=datetime.utcnow()
        )
        db.add(new_purchase)
        
        # Update product stock
        if product.stock < purchase.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock. Available: {product.stock}, Requested: {purchase.quantity}"
            )
            
        product.stock -= purchase.quantity
        product.updated_at = datetime.utcnow()
        db.add(product)
        
        # Flush to get the purchase ID
        db.flush()

        # Create first installment (paid amount)
        if paid_amount > 0:
            first_installment = models.Installment(
                purchase_id=new_purchase.id,
                installment_no=1,
                amount=paid_amount,
                due_date=datetime.utcnow(),
                is_paid=True,
                paid_date=datetime.utcnow()
            )
            db.add(first_installment)

        # Create second installment if there's remaining amount
        if due_amount > 0:
            second_installment = models.Installment(
                purchase_id=new_purchase.id,
                installment_no=2,
                amount=due_amount,
                due_date=datetime.utcnow() + timedelta(days=30),
                is_paid=False,
                paid_date=None
            )
            db.add(second_installment)

        # Commit the transaction
        db.commit()
        db.refresh(new_purchase)
        
        # Load installments for response
        installments = db.query(models.Installment).filter(
            models.Installment.purchase_id == new_purchase.id
        ).all()
        
        return new_purchase

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process purchase"
        )

def get_purchases_with_installments(db: Session, user_id: int = None, page: int = 1, page_size: int = 10):
    """Get purchases with their installments"""
    query = db.query(models.Purchase)

    if user_id:
        query = query.filter(models.Purchase.user_id == user_id)

    # Calculate offset
    offset = (page - 1) * page_size

    # Get paginated purchases
    purchases = query.order_by(models.Purchase.created_at.desc()).offset(offset).limit(page_size).all()

    # Get installments for each purchase
    result = []
    for purchase in purchases:
        installments = db.query(models.Installment).filter(
            models.Installment.purchase_id == purchase.id
        ).all()

        # Create response object with all required fields
        purchase_response = {
            "id": purchase.id,
            "user_id": purchase.user_id,
            "product_id": purchase.product_id,
            "quantity": purchase.quantity,
            "total_amount": purchase.total_amount,
            "paid_amount": purchase.paid_amount,
            "due_amount": purchase.due_amount,
            "number_of_installments": purchase.number_of_installments,
            "created_at": purchase.created_at,
            "updated_at": purchase.updated_at,
            "purchase_installments": installments
        }
        result.append(purchase_response)

    return result
