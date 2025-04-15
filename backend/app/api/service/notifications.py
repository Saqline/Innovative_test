from app.db import models
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Tuple
from sqlalchemy import desc, asc
from app.core.security import is_admin

def get_notifications(db: Session,current_user: models.User, skip: int = 0, limit: int = 10, order_by: str = "created_at",) -> Tuple[list[models.Notification], int]:
    if order_by == "id":
        order = desc(models.Notification.id)
    elif order_by == "created_at":
        order = desc(models.Notification.created_at)
    else:
        order = desc(models.Notification.created_at)

    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create notifications"
        )
    notifications = db.query(models.Notification).order_by(order).offset(skip).limit(limit).all()
    total = db.query(models.Notification).count()
    return notifications, total

def create_notification(db: Session, notification_data, current_user: models.User) -> models.Notification:
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can create notifications"
        )
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create notifications"
        )
    notification = models.Notification(**notification_data.model_dump())
    db.add(notification)
    db.commit()
    from app.core.email_utils import send_email

    db.refresh(notification)

    if notification.notification_type == "email":
        user = db.query(models.User).filter(models.User.id == notification.user_id).first()
        if user:
            send_email(to_email=user.email, subject="New Notification", body=notification.message)

    return notification
