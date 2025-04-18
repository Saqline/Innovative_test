from typing import List
from datetime import datetime, timedelta
from app.api.schemas.installments import InstallmentResponse
from pydantic import BaseModel, Field, validator


class PurchaseResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    total_amount: float
    paid_amount: float
    due_amount: float
    number_of_installments: int
    status: str
    created_at: datetime
    updated_at: datetime | None
    purchase_installments: List[InstallmentResponse]

    class Config:
        from_attributes = True


class InstallmentPlan(BaseModel):
    amount: float
    days_after: int  # Days after purchase date

    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Installment amount must be greater than 0')
        return float(v)

    @validator('days_after')
    def validate_days(cls, v):
        if v < 0:
            raise ValueError('Days must be 0 or positive')
        return v

class PurchaseCreate(BaseModel):
    user_id: int = Field(..., gt=0)
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., ge=1)
    installment_plan: List[InstallmentPlan]

    @validator('installment_plan')
    def validate_installment_plan(cls, v, values):
        if not v:
            raise ValueError('At least one installment is required')
        return v


class PurchaseWithInstallmentsResponse(PurchaseResponse):
    purchase_installments: List[InstallmentResponse]

    class Config:
        from_attributes = True
