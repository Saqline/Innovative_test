from app.api.router import  auth, installments, purchases, users
from fastapi import FastAPI
from app.api.router import products,reports,notifications
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db.session import engine
from app.db.base import Base
from app.db import models
from app.api.schemas.auth import UserCreate
from app.api.service.auth import create_user
from app.core.security import get_password_hash
Base.metadata.create_all(bind=engine)

def create_admin_user(db: Session):
    
    hashed_password = get_password_hash("admin")
    admin_data = UserCreate(
        name="admin",
        email="admin@admin.com",
        password=hashed_password
    )
    
    existing_admin = db.query(models.User).filter(
        models.User.email == admin_data.email
    ).first()
    
    if existing_admin:
        if existing_admin:
            existing_admin.hashed_password = hashed_password
            existing_admin.role = "admin"
            existing_admin.is_active=True
            existing_admin.is_verified=True
            db.commit()
    else:
        admin_user = create_user(db, admin_data)
        admin_user.role = "admin"
        admin_user.is_active=True
        admin_user.is_verified=True
        db.commit()

app = FastAPI(title="Installment Tracker API")

# Create admin user on startup
with Session(engine) as db:
    create_admin_user(db)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(purchases.router, prefix="/api/v1/purchases", tags=["Purchases"])
app.include_router(installments.router, prefix="/api/v1/installments", tags=["Installments"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])

app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
