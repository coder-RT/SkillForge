from datetime import datetime
from enum import Enum
from sqlalchemy import Boolean, Column, DateTime, Enum as PgEnum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class RoleEnum(str, Enum):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profiles = relationship("Profile", back_populates="user", cascade="all,delete")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True)
    role = Column(PgEnum(RoleEnum), nullable=False)
    is_default = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="profiles")