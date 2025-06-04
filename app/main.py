from fastapi import FastAPI
from app.api.v1 import users as users_router
from app.graphql.schema import gql_app

app = FastAPI(title="TutorHub API")
app.include_router(users_router.router)
app.include_router(gql_app, prefix="/graphql")