from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.reports import ReportRequest, ReportResponse
from app.api.service.reports import generate_report
from app.core.security import is_admin
from app.db.models import User

router = APIRouter()

@router.get("/", response_model=ReportResponse)
def generate_admin_report(
    report_request: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(is_admin)
):
    return generate_report(db, report_request)
