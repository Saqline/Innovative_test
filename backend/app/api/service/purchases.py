from sqlalchemy.orm import Session
from app.db import models
from app.api.schemas.purchases import PurchaseCreate
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy import update
from decimal import Decimal
from typing import Optional, List, Tuple
from sqlalchemy.orm import joinedload

def create_purchase(db: Session, purchase: PurchaseCreate, current_user_id: int):
    """Create a new purchase with custom installments"""
    
    # Verify user exists and check permissions
    target_user = db.query(models.User).filter(models.User.id == purchase.user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # # Only allow admin to create purchases for other users
    # requesting_user = db.query(models.User).filter(models.User.id == current_user_id).first()
    # if purchase.user_id != current_user_id and requesting_user.role != "admin":
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Not authorized to create purchase for other users"
    #     )
    
    # Get product and check stock
    product = db.query(models.Product).filter(models.Product.id == purchase.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    if product.stock < purchase.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Available: {product.stock}, Requested: {purchase.quantity}"
        )

    # Calculate total amount
    total_amount = Decimal(str(product.price)) * Decimal(str(purchase.quantity))
    total_amount = float(total_amount)

    # Validate total installment amounts match product price
    total_installments = sum(inst.amount for inst in purchase.installment_plan)
    if abs(total_installments - total_amount) > 0.01:  # Allow small float precision difference
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sum of installments ({total_installments}) must equal total amount ({total_amount})"
        )

    purchase_date = datetime.utcnow()
    
    try:
        # Create purchase record
        new_purchase = models.Purchase(
            user_id=purchase.user_id,  # Use the provided user_id
            product_id=purchase.product_id,
            quantity=purchase.quantity,
            total_amount=total_amount,
            paid_amount=0,  # Will be updated as installments are paid
            due_amount=total_amount,
            number_of_installments=len(purchase.installment_plan),
            status=models.PaymentStatusEnum.pending.value,
            created_at=purchase_date
        )
        db.add(new_purchase)
        
        # Update product stock
        product.stock -= purchase.quantity
        product.updated_at = purchase_date
        db.add(product)
        
        # Flush to get the purchase ID
        db.flush()

        # Create installments based on the plan
        for i, installment_plan in enumerate(purchase.installment_plan, start=1):
            due_date = purchase_date + timedelta(days=installment_plan.days_after)
            
            installment = models.Installment(
                purchase_id=new_purchase.id,
                installment_no=i,
                amount=installment_plan.amount,
                due_date=due_date,
                is_paid=False,
                status=models.PaymentStatusEnum.pending.value,
                paid_date=None
            )
            db.add(installment)

        # Commit the transaction
        db.commit()
        db.refresh(new_purchase)
        
        return new_purchase

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process purchase"
        )

def get_purchases_with_installments(
    db: Session,
    user_id: Optional[int] = None,
    page: int = 1,
    page_size: int = 10,
    status: Optional[str] = None
) -> List[models.Purchase]:
    query = db.query(models.Purchase)\
        .options(joinedload(models.Purchase.purchase_installments))
    
    # Apply user_id filter only if provided
    if user_id is not None:
        query = query.filter(models.Purchase.user_id == user_id)
    
    if status:
        query = query.filter(models.Purchase.status == status)
    
    # Calculate offset
    offset = (page - 1) * page_size
    
    # Get total count
    total = query.count()
    
    # Get paginated results
    purchases = query.order_by(models.Purchase.created_at.desc())\
        .offset(offset)\
        .limit(page_size)\
        .all()
    
    return purchases
