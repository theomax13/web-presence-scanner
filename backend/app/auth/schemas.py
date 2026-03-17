from pydantic import BaseModel, ConfigDict


class CurrentUser(BaseModel):
    id: str
    email: str

    model_config = ConfigDict(frozen=True)
