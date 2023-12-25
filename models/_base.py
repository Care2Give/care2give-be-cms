from typing import Literal
from pydantic import BaseModel, Field

__all__ = [
    'BaseResponse',
    'BaseError'
]

class BaseResponse(BaseModel):
    status: Literal["SUCCESS", "ERROR"]

class BaseError(BaseResponse):
    error: str
    message: str
