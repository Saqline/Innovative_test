from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime, timedelta
from app.api.schemas.reports import ReportRequest, ReportResponse
from sqlalchemy import func

def generate_report(db: Session, report_request: ReportRequest):
    start_date = report_request.start_date
    end_date = report_request.end_date

    weekly_paid_amount = 0
    weekly_due_amount = 0
    monthly_paid_amount = 0
    monthly_due_amount = 0 

    weekly_start = start_date
    while weekly_start < end_date:
        weekly_end = min(weekly_start + timedelta(days=7), end_date)
        weekly_paid_amount += db.query(models.Purchase).filter(
            models.Purchase.created_at >= weekly_start,
            models.Purchase.created_at < weekly_end
        ).with_entities(func.sum(models.Purchase.paid_amount)).scalar() or 0

        weekly_due_amount += db.query(models.Purchase).filter(
            models.Purchase.created_at >= weekly_start,
            models.Purchase.created_at < weekly_end
        ).with_entities(func.sum(models.Purchase.due_amount)).scalar() or 0

        weekly_start = weekly_end

    monthly_start = start_date
    while monthly_start < end_date:
        monthly_end = min(monthly_start + timedelta(days=30), end_date)

        monthly_paid_amount += db.query(models.Purchase).filter(
            models.Purchase.created_at >= monthly_start,
            models.Purchase.created_at < monthly_end
        ).with_entities(func.sum(models.Purchase.paid_amount)).scalar() or 0

        monthly_due_amount += db.query(models.Purchase).filter(
            models.Purchase.created_at >= monthly_start,
            models.Purchase.created_at < monthly_end
        ).with_entities(func.sum(models.Purchase.due_amount)).scalar() or 0

        monthly_start = monthly_end

    report_response = ReportResponse(
        weekly_paid_amount=weekly_paid_amount,
        weekly_due_amount=weekly_due_amount,
        monthly_paid_amount=monthly_paid_amount,
        monthly_due_amount=monthly_due_amount,
    )

    return report_response
