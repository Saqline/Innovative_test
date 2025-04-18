from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from .products import ProductResponse

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")

class CartItemResponse(CartItemBase):
    id: int
    created_at: datetime
    updated_at: datetime
    product: ProductResponse

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    total_amount: float

    class Config:
        from_attributes = True