from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from fastapi import HTTPException, status
from typing import Tuple
from app.db import models
from app.api.schemas.categories import CategoryCreate, CategoryUpdate

def get_categories(
    db: Session, 
    skip: int = 0, 
    limit: int = 10, 
    order_by: str = "created_at"
) -> Tuple[list[models.Category], int]:
    if order_by == "id":
        order = desc(models.Category.id)
    elif order_by == "name":
        order = asc(models.Category.name)
    else:
        order = desc(models.Category.created_at)
    
    categories = db.query(models.Category).order_by(order).offset(skip).limit(limit).all()
    total = db.query(models.Category).count()
    return categories, total

def create_category(db: Session, category_data: CategoryCreate) -> models.Category:
    # Check if category with same name exists
    existing_category = db.query(models.Category).filter(
        models.Category.name == category_data.name
    ).first()
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    
    category = models.Category(**category_data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def get_category(db: Session, category_id: int) -> models.Category:
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

def update_category(
    db: Session, 
    category_id: int, 
    category_data: CategoryUpdate
) -> models.Category:
    category = get_category(db, category_id)
    
    # Check if new name conflicts with existing category
    if category_data.name != category.name:
        existing_category = db.query(models.Category).filter(
            models.Category.name == category_data.name
        ).first()
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this name already exists"
            )
    
    for field, value in category_data.model_dump().items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    return category

def delete_category(db: Session, category_id: int) -> None:
    category = get_category(db, category_id)
    
    # Check if category has associated products
    if category.products:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category with associated products"
        )
    
    db.delete(category)
    db.commit()