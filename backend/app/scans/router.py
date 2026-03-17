import asyncio
import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sse_starlette.sse import EventSourceResponse

from app.auth.dependencies import get_current_user
from app.auth.schemas import CurrentUser
from app.config import settings
from app.database import get_session
from app.scans import service
from app.scans.schemas import ScanCreate, ScanOut, ScanResultOut

router = APIRouter(prefix="/scans", tags=["scans"])


@router.post("", response_model=ScanOut, status_code=status.HTTP_201_CREATED)
async def create_scan(
    body: ScanCreate,
    session: AsyncSession = Depends(get_session),
    user: CurrentUser = Depends(get_current_user),
):
    scan = await service.create_scan(session, body.query, user_id=user.id)

    cache = None
    if settings.redis_url:
        try:
            from redis.asyncio import Redis

            from app.services.cache_service import CacheService

            redis = Redis.from_url(settings.redis_url)
            cache = CacheService(redis)
        except Exception:
            pass

    await service.run_scan(session, scan.id, cache)

    scan = await service.get_scan(session, scan.id)
    return scan


@router.get("/{scan_id}", response_model=ScanOut)
async def get_scan(
    scan_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    user: CurrentUser = Depends(get_current_user),
):
    scan = await service.get_scan(session, scan_id)
    if not scan or scan.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found"
        )
    return scan


@router.get("/{scan_id}/stream")
async def stream_scan(
    scan_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    user: CurrentUser = Depends(get_current_user),
):
    scan = await service.get_scan(session, scan_id)
    if not scan or scan.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found"
        )

    async def event_generator():
        seen_completed: set[uuid.UUID] = set()
        while True:
            await session.refresh(scan, ["results"])

            for result in scan.results:
                if (
                    result.status in ("completed", "error")
                    and result.id not in seen_completed
                ):
                    seen_completed.add(result.id)
                    data = ScanResultOut.model_validate(result).model_dump(mode="json")
                    yield {"event": "result", "data": json.dumps(data, default=str)}

            if scan.status in ("completed", "failed"):
                yield {
                    "event": "done",
                    "data": json.dumps({"status": scan.status}),
                }
                break

            await asyncio.sleep(0.5)

    return EventSourceResponse(event_generator())
