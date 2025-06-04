# app/graphql/schema.py
import strawberry
from app.core.database import AsyncSessionLocal
from app.services.user import UserService
from app.repositories.user import SQLAlchemyUserRepository
from app.deps import get_user_service 


# async def get_user_service() -> UserService:
#     async with AsyncSessionLocal() as session:
#         yield UserService(SQLAlchemyUserRepository(session))


# -----------------  QUERY root (required) -----------------
@strawberry.type
class Query:
    @strawberry.field
    def ping(self) -> str:        # a trivial field so the type isn’t empty
        return "pong"

# -----------------  MUTATION root -----------------
@strawberry.type
class Mutation:
    @strawberry.mutation
    async def switch_role(self, info, user_id: int, new_role: str) -> bool:
        svc: UserService = await get_user_service().__anext__()
        return await svc.switch_role(user_id, new_role)


# app/graphql/schema.py  (bottom of file)

schema = strawberry.Schema(query=Query, mutation=Mutation)

# New: make a FastAPI-mountable router
from strawberry.fastapi import GraphQLRouter

gql_app = GraphQLRouter(schema)

