from app.db import models
from app.core.email_utils import send_email
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

def send_purchase_notification(
    db: Session, 
    purchase_id: int, 
    current_user: models.User,
    custom_message: str
) -> models.Notification:
    # Get purchase and verify ownership
    purchase = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase not found"
        )
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this purchase"
        )
    
    notification_data = {
        "user_id": purchase.user_id,
        "message": custom_message,
        "notification_type": "email"
    }
    
    notification = models.Notification(**notification_data)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    # Send email
    # user = db.query(models.User).filter(models.User.id == purchase.user_id).first()
    # if user:
    #     send_email(
    #         email_to=user.email,
    #         subject=f"Purchase Installment Information",
    #         body=notification.message
    #     )
    
    return notification
