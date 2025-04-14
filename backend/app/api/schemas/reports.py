from datetime import date
from pydantic import BaseModel, validator

class ReportRequest(BaseModel):
    start_date: date
    end_date: date

    @validator('end_date')
    def end_date_must_be_after_start_date(cls, end_date, values):
        start_date = values.get('start_date')
        if start_date and end_date <= start_date:
            raise ValueError('End date must be after start date')
        return end_date

class ReportResponse(BaseModel):
    weekly_paid_amount: float
    weekly_due_amount: float
    monthly_paid_amount: float
    monthly_due_amount: float
