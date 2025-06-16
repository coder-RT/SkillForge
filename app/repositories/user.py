import abc
from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, Profile, RoleEnum
from app.core.database import AsyncSessionLocal

# app/repositories/user.py
async def create(self, email: str, hashed_pw: str, roles: list[RoleEnum]) -> User:
    user = User(email=email, hashed_password=hashed_pw)
    user.profiles = [
        Profile(role=r, is_default=(r == roles[0])) for r in roles
    ]
    self.session.add(user)
    await self.session.flush()       # INSERTs happen here
    await self.session.refresh(user, ["profiles"])  # eager-load profiles
    return user                      # ORM instance now has profiles in-memory

class IUserRepository(abc.ABC):
    @abc.abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]: ...
    @abc.abstractmethod
    async def create(self, email: str, hashed_password: str, roles: List[RoleEnum]) -> User: ...
    @abc.abstractmethod
    async def set_default_role(self, user_id: int, role: RoleEnum) -> None: ...

# ──────────────────────────────────────────────────────────────
# SQLAlchemy Implementation (Adapter)
# ──────────────────────────────────────────────────────────────
class SQLAlchemyUserRepository(IUserRepository):
    """Data-access logic for User aggregated with Profile."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    # ---------- Queries ----------
    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    # ---------- Commands ----------
    async def create(
        self,
        email: str,
        hashed_password: str,
        roles: List[RoleEnum],
    ) -> User:
        user = User(email=email, hashed_password=hashed_password)

        # Build relationship in-memory — no DB round-trip
        user.profiles = [
            Profile(role=r, is_default=(r == roles[0])) for r in roles
        ]

        self.session.add(user)
        await self.session.commit()          # <--- make it permanent
        await self.session.refresh(user)     # so caller gets up-to-date fields
        await self.session.flush()                # INSERT users + profiles
        await self.session.refresh(user, ["profiles"])  # ensure profiles loaded
        return user                               # ORM instance ready for DTO conversion

    async def set_default_role(self, user_id: int, role: RoleEnum) -> None:
        # Clear previous default flags
        await self.session.execute(
            update(Profile)
            .where(Profile.user_id == user_id)
            .values(is_default=False)
        )
        # Set new default
        await self.session.execute(
            update(Profile)
            .where(
                Profile.user_id == user_id,
                Profile.role == role,
            )
            .values(is_default=True)
        )
        # Flush but let outer service decide commit/rollback
        await self.session.flush()