from endpoints.v1_routers import router as v1_router
from models import BaseError
from utils.exception import ApplicationException
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mangum import Mangum

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.exception_handler(ApplicationException)
async def handle_application_exception(_: Request, exc: ApplicationException):
    return JSONResponse(status_code=exc.error.status_code, content=BaseError(status="ERROR", error=exc.error.kind, message=exc.error.message).model_dump())

app.include_router(v1_router)
handler = Mangum(app)
