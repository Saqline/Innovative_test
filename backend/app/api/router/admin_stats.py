from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import is_admin_user,get_current_active_user
from app.db.models import User
from app.api.schemas.stats import AdminDashboardStats
from app.api.service.stats import get_admin_dashboard_stats

router = APIRouter()

@router.get("/dashboard", response_model=AdminDashboardStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
   
    is_admin_user(current_user)
    return get_admin_dashboard_stats(db, current_user)