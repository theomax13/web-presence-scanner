import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class ScanStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class ResultStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    ERROR = "error"


class InputType(str, Enum):
    EMAIL = "email"
    DOMAIN = "domain"
    USERNAME = "username"
    NAME = "name"


class ScanCreate(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Search query")


class ScanResultOut(BaseModel):
    id: uuid.UUID
    source: str
    status: ResultStatus
    data: dict | None = None
    error: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ScanOut(BaseModel):
    id: uuid.UUID
    query: str
    input_type: InputType
    status: ScanStatus
    created_at: datetime
    completed_at: datetime | None = None
    results: list[ScanResultOut] = []

    model_config = ConfigDict(from_attributes=True)
