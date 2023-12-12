from .auth import router as auth_router
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1",
)

router.include_router(auth_router)
