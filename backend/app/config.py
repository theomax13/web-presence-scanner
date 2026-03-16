from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/postgres"
    redis_url: str = "redis://redis:6379/0"

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    # API keys
    hibp_api_key: str = ""
    google_api_key: str = ""
    google_cse_id: str = ""

    # Cache TTL in seconds (default 1 hour)
    cache_ttl: int = 3600

    model_config = {"env_file": ".env"}


settings = Settings()
