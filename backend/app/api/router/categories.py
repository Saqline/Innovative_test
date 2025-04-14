from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.categories import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryListResponse
)
from app.api.service.categories import (
    get_categories,
    create_category,
    get_category,
    update_category,
    delete_category
)
from app.core.security import get_current_active_user, is_admin
from app.db import models

router = APIRouter()

@router.get("/", response_model=CategoryListResponse)
def list_categories(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    order_by: str = Query("created_at"),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    categories, total = get_categories(db, skip=skip, limit=size, order_by=order_by)
    return {
        "items": categories,
        "total": total,
        "page": page,
        "size": size
    }

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_new_category(
    category_data: CategoryCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can create categories"
        )
    return create_category(db, category_data)

@router.get("/{category_id}", response_model=CategoryResponse)
def read_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    return get_category(db, category_id)

@router.patch("/{category_id}", response_model=CategoryResponse)
def update_existing_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can update categories"
        )
    return update_category(db, category_id, category_data)

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_category(
    category_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can delete categories"
        )
    delete_category(db, category_id)
    return None