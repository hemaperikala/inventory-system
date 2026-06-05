from pydantic import BaseModel
from typing import Optional
import datetime

class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: float
    stock: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class Customer(CustomerBase):
    id: int
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_id: int
    product_id: int
    quantity: int

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    total_price: float
    status: str
    created_at: datetime.datetime
    class Config:
        from_attributes = True