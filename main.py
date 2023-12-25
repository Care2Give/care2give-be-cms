from contextlib import asynccontextmanager
from endpoints.v1_routers import router as v1_router
from models import BaseError
from utils.aws import init
from utils.exception import ApplicationException, Generic
from utils.logging import initialise_logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mangum import Mangum

LOGGER = initialise_logging('ROOT')
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.exception_handler(ApplicationException)
async def handle_application_exception(_: Request, exc: ApplicationException):
    if exc == Generic.UNKNOWN:
        LOGGER.exception('Unknown exception encountered', exc_info=exc)
    return JSONResponse(status_code=exc.error.status_code, content=BaseError(status="ERROR", error=exc.error.kind, message=exc.error.message).model_dump())

app.include_router(v1_router)
handler = Mangum(app)
