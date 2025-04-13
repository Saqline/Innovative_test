from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.schemas.notifications import (
    NotificationCreate,
    NotificationResponse,
    NotificationListResponse
)
from app.api.service.notifications import (
    get_notifications,
    create_notification,
    
)
from app.core.security import get_current_active_user, oauth2_scheme
from app.db import models

router = APIRouter()

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_new_notification(
    notification_data: NotificationCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return create_notification(db, notification_data, current_user)

@router.get("/", response_model=NotificationListResponse)
def list_notifications(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    order_by: str = Query("created_at"),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    notifications, total = get_notifications(db,current_user, skip=skip, limit=size, order_by=order_by)
    return {
        "items": notifications,
        "total": total,
        "page": page,
        "size": size
    }



