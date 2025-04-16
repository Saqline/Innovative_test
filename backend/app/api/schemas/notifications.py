from pydantic import BaseModel, Field, validator

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

class PurchaseNotificationCreate(BaseModel):
    message: str = Field(
        ...,  # Makes the field required
        min_length=1,
        max_length=500,
        description="Custom message for the purchase notification"
    )

    @validator('message')
    def validate_message(cls, v):
        if not v.strip():
            raise ValueError('Message cannot be empty or just whitespace')
        return v.strip()
