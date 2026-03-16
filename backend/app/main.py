from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Register scanners
    from app.scanners.registry import registry
    from app.scanners.hibp import HIBPScanner
    from app.scanners.web_search import WebSearchScanner

    registry.register(HIBPScanner())
    registry.register(WebSearchScanner())

    yield


app = FastAPI(title="Web Presence Scanner", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
