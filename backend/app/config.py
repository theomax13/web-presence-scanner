from pathlib import Path

from pydantic_settings import BaseSettings

# .env at project root (web-presence-scanner/.env)
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

    # Cache TTL in seconds (default 1 hour)
    cache_ttl: int = 3600

    model_config = {"env_file": str(_env_file), "extra": "ignore"}


settings = Settings()
