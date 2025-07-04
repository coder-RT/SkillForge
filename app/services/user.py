from typing import List
from passlib.hash import bcrypt
from app.models.user import RoleEnum
from app.schemas.user import UserCreate
from app.repositories.user import IUserRepository

class UserService:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    async def register(self, dto: UserCreate):
        # To Do: Password strength check, Transactions: Wrap register in a DB transaction to ensure uniqueness + insert are atomic.
        # Replace ValueError with a custom EmailAlreadyExists exception that maps to HTTP 409.
        if await self.user_repo.get_by_email(dto.email):
            raise ValueError("Email already registered")
        hashed = bcrypt.hash(dto.password)
        return await self.user_repo.create(dto.email, hashed, dto.roles)

    async def switch_role(self, user_id: int, role: RoleEnum):
        # TO DO: More checks like: Teacher must have completed onboarding before being selectable
        await self.user_repo.set_default_role(user_id, role)