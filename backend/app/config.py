from pathlib import Path

from pydantic_settings import BaseSettings

_env_file = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    database_url: str = ""
    redis_url: str = ""

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    # API keys
    hibp_api_key: str = ""
    searlo_api_key: str = ""

    # Cache TTL in seconds
    cache_ttl: int = 3600

    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = {"env_file": str(_env_file), "extra": "ignore"}


settings = Settings()
