from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, RedisDsn


class Settings(BaseSettings):
    database_url: PostgresDsn = "postgresql+asyncpg://developer:developer@localhost:5432/skillforge"
    redis_url: RedisDsn = "redis://localhost:6379/0"

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
    }


settings = Settings()  # noqa: E305