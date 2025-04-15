from sqlalchemy.orm import Session
from app.db import models
from app.api.schemas.auth import UserCreate
from app.api.service.auth import create_user
from app.core.security import get_password_hash
from app.api.schemas.products import ProductCreate
from app.api.service.products import create_product

def create_default_users(db: Session):
    """Initialize default admin and customer users"""
    
    # Create admin user
    admin_data = UserCreate(
        name="admin",
        email="admin@admin.com",
        password="admin",
        phone_number="+1234567890"  
    )
    
    existing_admin = db.query(models.User).filter(
        models.User.email == admin_data.email
    ).first()
    
    if existing_admin:
        # Update existing admin
        hashed_password = get_password_hash("admin123")
        existing_admin.hashed_password = hashed_password
        existing_admin.role = "admin"
        existing_admin.is_active = True
        existing_admin.is_verified = True
        existing_admin.phone_number = admin_data.phone_number  
        db.commit()
    else:
        # Create new admin
        admin_user = create_user(db, admin_data)
        admin_user.role = "admin"
        admin_user.is_active = True
        admin_user.is_verified = True
        db.commit()

    # Create default customer user
    customer_data = UserCreate(
        name="string",
        email="user@example.com",
        password="string",
        phone_number="+9876543210"  # Added phone number
    )
    
    existing_customer = db.query(models.User).filter(
        models.User.email == customer_data.email
    ).first()
    
    if not existing_customer:
        # Create new customer
        customer_user = create_user(db, customer_data)
        customer_user.role = "customer"
        customer_user.is_active = True
        customer_user.is_verified = True
        db.commit()
    else:
        # Update existing customer
        hashed_password = get_password_hash("string123")
        existing_customer.hashed_password = hashed_password
        existing_customer.role = "customer"
        existing_customer.is_active = True
        existing_customer.is_verified = True
        existing_customer.phone_number = customer_data.phone_number  # Added phone number
        db.commit()

def create_default_categories(db: Session):
    """Initialize default product categories"""
    default_categories = [
        "Smartphones",
        "Laptops",
        "Gaming",
        "Tablets",
        "Audio",
        "TVs"
    ]
    
    categories = []
    for category_name in default_categories:
        existing_category = db.query(models.Category).filter(
            models.Category.name == category_name
        ).first()
        
        if existing_category:
            categories.append(existing_category)
            continue
        else:
            new_category = models.Category(name=category_name)
            db.add(new_category)
            db.commit()
            db.refresh(new_category)
            categories.append(new_category)
    
    return categories

def create_default_products(db: Session, categories: list[models.Category]):
    """Initialize default products"""
    default_products = [
        {
            "name": "Samsung Galaxy S21",
            "price": 1200.00,
            "stock": 15,
            "description": "The Samsung Galaxy S21 features a 6.2-inch Dynamic AMOLED 2X display, Exynos 2100 processor, and a triple camera setup.",
            "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
            "category_id": next(cat.id for cat in categories if cat.name == "Smartphones")
        },
        {
            "name": "MacBook Air M1",
            "price": 1800.00,
            "stock": 8,
            "description": "The MacBook Air with M1 chip delivers up to 3.5x faster performance than the previous generation while using less power.",
            "image_url": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "category_id": next(cat.id for cat in categories if cat.name == "Laptops")
        },
        {
            "name": "Sony PlayStation 5",
            "price": 600.00,
            "stock": 5,
            "description": "The PlayStation 5 offers lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and a new generation of incredible PlayStation games.",
            "image_url": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "category_id": next(cat.id for cat in categories if cat.name == "Gaming")
        },
        {
            "name": "iPad Pro 12.9",
            "price": 1099.00,
            "stock": 12,
            "description": "The iPad Pro 12.9-inch features the powerful M1 chip, Liquid Retina XDR display, and support for Apple Pencil, making it perfect for creative professionals.",
            "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "category_id": next(cat.id for cat in categories if cat.name == "Tablets")
        },
        {
            "name": "Sony WH-1000XM4",
            "price": 349.99,
            "stock": 20,
            "description": "Industry-leading noise canceling with Dual Noise Sensor technology, exceptional sound quality with 40mm drivers, and up to 30-hour battery life.",
            "image_url": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "category_id": next(cat.id for cat in categories if cat.name == "Audio")
        },
        {
            "name": "LG OLED C1 65-inch",
            "price": 2499.99,
            "stock": 7,
            "description": "Perfect blacks, infinite contrast, and over a billion colors powered by the α9 Gen 4 AI Processor 4K. Perfect for movies, sports, and gaming with HDMI 2.1 support.",
            "image_url": "https://images.unsplash.com/photo-1593784991095-a205069533cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "category_id": next(cat.id for cat in categories if cat.name == "TVs")
        }
    ]

    for product_data in default_products:
        # Check if product already exists
        existing_product = db.query(models.Product).filter(
            models.Product.name == product_data["name"]
        ).first()
        
        if not existing_product:
            product_schema = ProductCreate(**product_data)
            create_product(db, product_schema)

def initialize_data(db: Session):
    """Main function to initialize all default data"""
    create_default_users(db)
    categories = create_default_categories(db)
    create_default_products(db, categories)
