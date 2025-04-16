from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import models
from fastapi import HTTPException, status
from typing import Dict, Any

def get_admin_dashboard_stats(db: Session, current_user: models.User) -> Dict[str, Any]:
    # Verify admin role
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can access these statistics"
        )

    # Get total counts
    total_purchases = db.query(models.Purchase).count()
    total_installments = db.query(models.Installment).count()
    total_products = db.query(models.Product).count()

    # Get installment counts by status
    installment_stats = db.query(
        models.Installment.status,
        func.count(models.Installment.id).label('count')
    ).group_by(models.Installment.status).all()

    paid_count = 0
    pending_count = 0
    overdue_count = 0

    for status, count in installment_stats:
        if status == models.PaymentStatusEnum.paid.value:
            paid_count = count
        elif status == models.PaymentStatusEnum.pending.value:
            pending_count = count
        elif status == models.PaymentStatusEnum.overdue.value:
            overdue_count = count

    # Get income statistics
    income_stats = db.query(
        func.sum(models.Installment.amount).filter(
            models.Installment.status == models.PaymentStatusEnum.paid.value
        ).label('paid_amount'),
        func.sum(models.Installment.amount).filter(
            models.Installment.status == models.PaymentStatusEnum.pending.value
        ).label('pending_amount'),
        func.sum(models.Installment.amount).filter(
            models.Installment.status == models.PaymentStatusEnum.overdue.value
        ).label('overdue_amount')
    ).first()

    return {
        "total_purchases": total_purchases,
        "total_installments": total_installments,
        "total_products": total_products,
        "installments_stats": {
            "paid_count": paid_count,
            "pending_count": pending_count,
            "overdue_count": overdue_count
        },
        "income_stats": {
            "total_paid_amount": float(income_stats.paid_amount or 0),
            "total_pending_amount": float(income_stats.pending_amount or 0),
            "total_overdue_amount": float(income_stats.overdue_amount or 0)
        }
    }