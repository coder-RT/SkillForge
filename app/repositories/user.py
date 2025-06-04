import abc
from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, Profile, RoleEnum
from app.core.database import AsyncSessionLocal

class IUserRepository(abc.ABC):
    @abc.abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]: ...
    @abc.abstractmethod
    async def create(self, email: str, hashed_password: str, roles: List[RoleEnum]) -> User: ...
    @abc.abstractmethod
    async def set_default_role(self, user_id: int, role: RoleEnum) -> None: ...

class SQLAlchemyUserRepository(IUserRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str):
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, email: str, hashed_password: str, roles):
        user = User(email=email, hashed_password=hashed_password)
        self.session.add(user)
        await self.session.flush()  # get user.id
        for r in roles:
            user.profiles.append(Profile(role=r, is_default=(r == roles[0])))
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def set_default_role(self, user_id: int, role: RoleEnum):
        # reset flags then set desired role as default
        await self.session.execute(update(Profile).where(Profile.user_id == user_id).values(is_default=False))
        await self.session.execute(update(Profile).where(Profile.user_id == user_id, Profile.role == role).values(is_default=True))
        await self.session.commit()