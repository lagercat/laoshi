from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class BaseResponseModel(BaseModel):
    """Base model for API responses."""

    success: bool = True
    message: str | None = None


class ErrorResponse(BaseResponseModel):
    """Error response model."""

    success: bool = False
    error_code: str
    error_details: dict[str, Any] | None = None


class UserBase(BaseModel):
    """Base user model."""

    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    full_name: str | None = None


class UserCreate(UserBase):
    """User creation model."""

    password: str = Field(..., min_length=8)


class User(UserBase):
    """User model with ID and timestamps."""

    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
