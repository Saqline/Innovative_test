from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_active_user
from app.db import models
from app.api.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
    CartItemResponse,
    CartResponse
)
from app.api.service.cart import (
    get_cart_items,
    add_to_cart,
    update_cart_item,
    remove_from_cart,
    clear_cart,
    get_cart_total
)

router = APIRouter()

@router.get("/", response_model=CartResponse)
def read_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    
    items = get_cart_items(db, current_user.id)
    return {
        "items": items,
        "total_items": sum(item.quantity for item in items),
        "total_amount": get_cart_total(db, current_user.id)
    }

@router.post("/items", response_model=CartItemResponse)
def add_cart_item(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    
    return add_to_cart(db, current_user.id, item)

@router.patch("/items/{item_id}", response_model=CartItemResponse)
def update_item(
    item_id: int,
    item_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    
    return update_cart_item(db, current_user.id, item_id, item_data)

@router.delete("/items/{item_id}")
def delete_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    
    remove_from_cart(db, current_user.id, item_id)
    return {"message": "Item removed from cart"}

@router.delete("/")
def clear_user_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):

    clear_cart(db, current_user.id)
    return {"message": "Cart cleared"}