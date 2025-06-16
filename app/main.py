from fastapi import FastAPI
from app.api.v1 import users as users_router
from app.graphql.schema import gql_app
from app.core.database import lifespan

app = FastAPI(title="SKill Forge API", lifespan=lifespan)
app.include_router(users_router.router)
app.include_router(gql_app, prefix="/graphql")