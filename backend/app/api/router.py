from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.scan import router as scan_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router, tags=["health"])
api_router.include_router(scan_router)
