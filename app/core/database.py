"""Async SQLAlchemy engine & session factory (no legacy alias)."""

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator

from app.core.config import settings

DATABASE_URL: str = str(settings.database_url)  # Cast PostgresDsn → str

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

# Canonical async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


class Base(DeclarativeBase):
    """Base for all SQLAlchemy models."""


# Dependency‑injectable generator for FastAPI
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
        
# app/core/database.py  (bottom of file)
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    """Create all tables on startup (dev only)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)   # CREATE TABLE IF NOT EXISTS ...
    yield
    # no teardown needed