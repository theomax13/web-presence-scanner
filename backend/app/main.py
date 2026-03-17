import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings
from app.shared.exceptions import generic_exception_handler, validation_exception_handler
from app.shared.http_client import close_http_client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.scanners.hibp import HIBPScanner
    from app.scanners.registry import registry
    from app.scanners.web_search import WebSearchScanner

    registry.register(HIBPScanner())
    registry.register(WebSearchScanner())

    yield

    await close_http_client()


app = FastAPI(
    title="Scopaly",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(api_router)
