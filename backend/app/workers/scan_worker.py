import uuid

from arq.connections import RedisSettings

from app.config import settings
from app.database import async_session
from app.scanners.hibp import HIBPScanner
from app.scanners.web_search import WebSearchScanner
from app.scanners.registry import registry
from app.services.cache_service import CacheService
from app.services.scan_service import run_scan


async def execute_scan(ctx, scan_id: str):
    redis = ctx["redis"]
    cache = CacheService(redis)

    async with async_session() as session:
        await run_scan(session, uuid.UUID(scan_id), cache)


async def startup(ctx):
    registry.register(HIBPScanner())
    registry.register(WebSearchScanner())


class WorkerSettings:
    functions = [execute_scan]
    on_startup = startup
    redis_settings = RedisSettings.from_dsn(settings.redis_url)
