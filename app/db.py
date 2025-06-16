# app/db.py
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()     # auto-commit if everything succeeded
        except Exception:
            await session.rollback()
            raise