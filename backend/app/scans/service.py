import asyncio
import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.scans.models import Scan, ScanResult
from app.scanners.base import BaseScanner
from app.scanners.registry import registry
from app.services.cache_service import CacheService
from app.shared.input_detector import detect_input_type

logger = logging.getLogger(__name__)


async def create_scan(session: AsyncSession, query: str, user_id: str) -> Scan:
    input_type = detect_input_type(query)
    scan = Scan(query=query, input_type=input_type, status="pending", user_id=user_id)

    scanners = registry.get_for_input_type(input_type)
    for scanner in scanners:
        result = ScanResult(scan=scan, source=scanner.name, status="pending")
        session.add(result)

    session.add(scan)
    await session.commit()
    await session.refresh(scan, ["results"])
    return scan


async def get_scan(session: AsyncSession, scan_id: uuid.UUID) -> Scan | None:
    stmt = select(Scan).where(Scan.id == scan_id).options(selectinload(Scan.results))
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def run_scan(
    session: AsyncSession,
    scan_id: uuid.UUID,
    cache: CacheService | None = None,
) -> None:
    scan = await get_scan(session, scan_id)
    if not scan:
        return

    scan.status = "running"
    await session.commit()

    scanners = registry.get_for_input_type(scan.input_type)

    async def _run_single(scanner: BaseScanner, scan_result: ScanResult) -> None:
        if cache:
            cached = await cache.get(scanner.name, scan.query)
            if cached:
                scan_result.data = cached
                scan_result.status = "completed"
                await session.commit()
                return

        result = await scanner.scan(scan.query, scan.input_type)

        scan_result.data = result.data
        scan_result.error = result.error
        scan_result.status = "error" if result.error else "completed"

        if result.error:
            logger.warning(
                "Scanner %s failed for %r: %s",
                scanner.name,
                scan.query,
                result.error,
            )

        await session.commit()

        if cache and not result.error:
            await cache.set(scanner.name, scan.query, result.data)

    result_by_source = {r.source: r for r in scan.results}

    tasks = []
    for scanner in scanners:
        scan_result = result_by_source.get(scanner.name)
        if scan_result:
            tasks.append(_run_single(scanner, scan_result))

    await asyncio.gather(*tasks)

    scan.status = "completed"
    scan.completed_at = datetime.now(timezone.utc)
    await session.commit()
