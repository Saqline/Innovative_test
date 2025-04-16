from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from app.db import models
from app.api.schemas.cart import CartItemCreate, CartItemUpdate
from sqlalchemy.exc import IntegrityError

def get_cart_items(db: Session, user_id: int) -> List[models.CartItem]:
    """Get all cart items for a user"""
    return db.query(models.CartItem).filter(
        models.CartItem.user_id == user_id
    ).all()

def add_to_cart(db: Session, user_id: int, cart_item: CartItemCreate) -> models.CartItem:
    """Add item to cart or update quantity if already exists"""
    try:
        # Check if product exists and has enough stock
        product = db.query(models.Product).filter(
            models.Product.id == cart_item.product_id
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        if product.stock < cart_item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock. Available: {product.stock}"
            )

        # Check if item already in cart
        existing_item = db.query(models.CartItem).filter(
            models.CartItem.user_id == user_id,
            models.CartItem.product_id == cart_item.product_id
        ).first()

        if existing_item:
            # Update quantity
            existing_item.quantity = cart_item.quantity
            db.commit()
            db.refresh(existing_item)
            return existing_item

        # Create new cart item
        new_item = models.CartItem(
            user_id=user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid cart operation"
        )

def update_cart_item(
    db: Session, 
    user_id: int, 
    cart_item_id: int, 
    item_data: CartItemUpdate
) -> models.CartItem:
    """Update cart item quantity"""
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == cart_item_id,
        models.CartItem.user_id == user_id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    # Check if product has enough stock
    if cart_item.product.stock < item_data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Available: {cart_item.product.stock}"
        )

    cart_item.quantity = item_data.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

def remove_from_cart(db: Session, user_id: int, cart_item_id: int) -> None:
    """Remove item from cart"""
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == cart_item_id,
        models.CartItem.user_id == user_id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    db.delete(cart_item)
    db.commit()

def clear_cart(db: Session, user_id: int) -> None:
    """Remove all items from user's cart"""
    db.query(models.CartItem).filter(
        models.CartItem.user_id == user_id
    ).delete()
    db.commit()

def get_cart_total(db: Session, user_id: int) -> float:
    """Calculate total amount in cart"""
    cart_items = get_cart_items(db, user_id)
    return sum(item.quantity * item.product.price for item in cart_items)