from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ProductBase(BaseModel):
    name: str
    price: float
    stock: int = Field(ge=0)  # Ensure stock is non-negative
    description: Optional[str] = None
    category_id: int
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = Field(None, ge=0)
    category_id: Optional[int] = None
    image_url: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: "CategoryResponse"

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    size: int

# Avoid circular import
from app.api.schemas.categories import CategoryResponse
ProductResponse.model_rebuild()
