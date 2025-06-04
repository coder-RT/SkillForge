from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db, AsyncSessionLocal   # ← updated import
from app.schemas.user import UserCreate, UserOut
from app.repositories.user import SQLAlchemyUserRepository
from app.services.user import UserService
from app.deps import get_user_service 

router = APIRouter(prefix="/users", tags=["users"])

# async def get_user_service(session: AsyncSession = Depends(AsyncSessionLocal)):
#     repo = SQLAlchemyUserRepository(session)
#     return UserService(repo)

# @router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
# async def register_user(dto: UserCreate, svc: UserService = Depends(get_user_service)):
#     try:
#         return await svc.register(dto)
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))

# app/api/v1/users.py
from fastapi import APIRouter, Depends, status
from app.schemas.user import UserRegisterRequest, UserOut    # response DTO
from app.services.user import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post(
    "",                         # POST /users
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
async def register_user(
    payload: UserRegisterRequest,                 # ← body model
    svc: UserService = Depends(get_user_service),
):
    user = await svc.register(
        email=payload.email,
        password=payload.password,
        roles=set(payload.roles),
    )
    return user
