# app/deps.py
from typing import AsyncGenerator
from app.core.database import AsyncSessionLocal
from app.services.user import UserService
from app.repositories.user import SQLAlchemyUserRepository

async def get_user_service() -> AsyncGenerator[UserService, None]:
    async with AsyncSessionLocal() as session:
        yield UserService(SQLAlchemyUserRepository(session))
