from typing import List
from pydantic import BaseModel, EmailStr, constr
from app.models.user import RoleEnum

class ProfileOut(BaseModel):
    role: RoleEnum
    is_default: bool
    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    profiles: List[ProfileOut]
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    roles: List[RoleEnum] = [RoleEnum.STUDENT]
    
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)        # basic strength check
    roles: List[RoleEnum]