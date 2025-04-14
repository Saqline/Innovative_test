from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.api.schemas.products import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse
)
from app.api.service.products import (
    create_product,
    get_product,
    get_products,
    update_product,
    delete_product
)
from app.core.security import get_current_active_user, is_admin
from app.db import models

router = APIRouter()

@router.get("/", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    products, total = get_products(
        db, 
        skip=skip, 
        limit=size,
        category_id=category_id
    )
    return {
        "items": products,
        "total": total,
        "page": page,
        "size": size
    }

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_new_product(
    product_data: ProductCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can create products"
        )
    return create_product(db, product_data)

@router.get("/{product_id}", response_model=ProductResponse)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return get_product(db, product_id)

@router.patch("/{product_id}", response_model=ProductResponse)
def update_existing_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can update products"
        )
    return update_product(db, product_id, product_data)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_product(
    product_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can delete products"
        )
    delete_product(db, product_id)
    return None
