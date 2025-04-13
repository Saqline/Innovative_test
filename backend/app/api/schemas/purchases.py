from datetime import datetime
from pydantic import BaseModel

class PurchaseCreate(BaseModel):
    product_id: int
    paid_amount: float

from typing import List
from app.api.schemas.installments import InstallmentResponse

class PurchaseResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    total_amount: float
    paid_amount: float
    due_amount: float
    created_at: datetime

    class Config:
        from_attributes = True

class PurchaseWithInstallmentsResponse(PurchaseResponse):
    installments: List[InstallmentResponse]
