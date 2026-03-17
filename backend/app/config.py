from pathlib import Path

from pydantic_settings import BaseSettings

# Try project root .env for local dev (web-presence-scanner/.env)
# In Docker, env vars are injected via docker-compose env_file — no .env needed
_candidates = [
    Path(__file__).resolve().parents[2] / ".env",  # local: backend/app/config.py -> ../../.env
    Path("/app").parent / ".env",                   # fallback
]
_env_file = next((p for p in _candidates if p.is_file()), None)


class Settings(BaseSettings):
    database_url: str = ""
    redis_url: str = "redis://localhost:6379"

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

    model_config = {
        "env_file": str(_env_file) if _env_file else None,
        "extra": "ignore",
    }


settings = Settings()
