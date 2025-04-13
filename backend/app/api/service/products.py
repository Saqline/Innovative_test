from app.db import models
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from fastapi import HTTPException, status
from app.api.schemas.products import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse
)
from typing import Tuple


def get_products(db: Session, skip: int = 0, limit: int = 10, order_by: str = "created_at") -> Tuple[list[models.Product], int]:
    if order_by == "id":
        order = desc(models.Product.id)
    elif order_by == "created_at":
        order = desc(models.Product.created_at)
    else:
        order = desc(models.Product.created_at)
    products = db.query(models.Product).order_by(order).offset(skip).limit(limit).all()
    total = db.query(models.Product).count()
    return products, total

def create_product(db: Session, product_data: ProductCreate) -> models.Product:
    product = models.Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

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
    for field, value in product_data.model_dump().items():
        setattr(product, field, value)
    product.updated_at = models.datetime.utcnow()
    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, product_id: int) -> None:
    product = get_product(db, product_id)
    db.delete(product)
    db.commit()
