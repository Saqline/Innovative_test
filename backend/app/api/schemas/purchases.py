from pydantic import BaseModel, Field, validator
from decimal import Decimal
from datetime import datetime
from typing import List
from .installments import InstallmentResponse

class PurchaseCreate(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., ge=1)
    paid_amount: float = Field(..., ge=0)

    @validator('paid_amount')
    def validate_paid_amount(cls, v):
        if v < 0:
            raise ValueError('Paid amount cannot be negative')
        return float(v)

    @validator('quantity')
    def validate_quantity(cls, v):
        if v < 1:
            raise ValueError('Quantity must be at least 1')
        return v

class PurchaseResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    total_amount: float
    paid_amount: float
    due_amount: float
    number_of_installments: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

class PurchaseWithInstallmentsResponse(PurchaseResponse):
    purchase_installments: List[InstallmentResponse]

    class Config:
        from_attributes = True
