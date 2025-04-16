from pydantic import BaseModel

class AdminDashboardStats(BaseModel):
    total_purchases: int
    total_installments: int
    total_products: int
    installments_stats: dict = {
        "paid_count": int,
        "pending_count": int,
        "overdue_count": int
    }
    income_stats: dict = {
        "total_paid_amount": float,
        "total_pending_amount": float,
        "total_overdue_amount": float
    }