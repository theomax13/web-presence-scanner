import json

from redis.asyncio import Redis

from app.config import settings


class CacheService:
    def __init__(self, redis: Redis):
        self.redis = redis
        self.ttl = settings.cache_ttl

    def _key(self, source: str, query: str) -> str:
        return f"scan:{source}:{query.lower().strip()}"

    async def get(self, source: str, query: str) -> dict | None:
        raw = await self.redis.get(self._key(source, query))
        if raw:
            return json.loads(raw)
        return None

    async def set(self, source: str, query: str, data: dict):
        await self.redis.set(self._key(source, query), json.dumps(data), ex=self.ttl)
