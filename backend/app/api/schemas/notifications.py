from pydantic import BaseModel
from typing import Optional

class NotificationBase(BaseModel):
    message: str
    notification_type: str

class NotificationCreate(NotificationBase):
    user_id: int


class NotificationResponse(NotificationBase):
    id: int
    is_read: bool
    user_id: int

    class Config:
        from_attributes = True

class NotificationListResponse(BaseModel):
    items: list[NotificationResponse]
    total: int
    page: int
    size: int
