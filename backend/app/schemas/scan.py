import uuid
from datetime import datetime

from pydantic import BaseModel


class ScanCreate(BaseModel):
    query: str


class ScanResultOut(BaseModel):
    id: uuid.UUID
    source: str
    status: str
    data: dict | None = None
    error: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ScanOut(BaseModel):
    id: uuid.UUID
    query: str
    input_type: str
    status: str
    created_at: datetime
    completed_at: datetime | None = None
    results: list[ScanResultOut] = []

    model_config = {"from_attributes": True}
