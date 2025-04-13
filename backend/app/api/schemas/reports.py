from datetime import datetime
from pydantic import BaseModel

class ReportRequest(BaseModel):
    start_date: datetime
    end_date: datetime

class ReportResponse(BaseModel):
    weekly_paid_amount: float
    weekly_due_amount: float
    monthly_paid_amount: float
    monthly_due_amount: float
