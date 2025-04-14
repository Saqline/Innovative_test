from datetime import datetime
from pydantic import BaseModel

class InstallmentResponse(BaseModel):
    id: int
    purchase_id: int
    installment_no: int
    amount: float
    due_date: datetime
    is_paid: bool
    paid_date: datetime | None

    class Config:
        from_attributes = True
