from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.reports import ReportRequest, ReportResponse
from app.api.service.reports import generate_report
from app.core.security import is_admin
from app.db.models import User

router = APIRouter()

@router.get("/", response_model=ReportResponse)
def generate_admin_report(
    start_date_str: str = Query(..., description="Report start date (YYYY-MM-DD)"),
    end_date_str: str = Query(..., description="Report end date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(is_admin)
):
    try:
        start_date = date.fromisoformat(start_date_str)
        end_date = date.fromisoformat(end_date_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Please use YYYY-MM-DD."
        )

    report_request = ReportRequest(start_date=start_date, end_date=end_date)
    return generate_report(db, report_request)
