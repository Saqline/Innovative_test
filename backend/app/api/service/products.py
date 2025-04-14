from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, Tuple
from app.db import models
from app.api.schemas.products import ProductCreate, ProductUpdate
from datetime import datetime

def create_product(db: Session, product_data: ProductCreate) -> models.Product:
    # Verify category exists
    category = db.query(models.Category).filter(
        models.Category.id == product_data.category_id
    ).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    product = models.Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_products(
    db: Session, 
    skip: int = 0, 
    limit: int = 10,
    category_id: Optional[int] = None
) -> Tuple[list[models.Product], int]:
    query = db.query(models.Product)
    
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    return products, total

def get_product(db: Session, product_id: int) -> models.Product:
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

def update_product(db: Session, product_id: int, product_data: ProductUpdate) -> models.Product:
    product = get_product(db, product_id)
    
    # If category_id is being updated, verify the new category exists
    if product_data.category_id and product_data.category_id != product.category_id:
        category = db.query(models.Category).filter(
            models.Category.id == product_data.category_id
        ).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, product_id: int) -> None:
    product = get_product(db, product_id)
    
    # Check if product has any purchases
    if product.purchases:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete product with existing purchases"
        )
    
    db.delete(product)
    db.commit()
