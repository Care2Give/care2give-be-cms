from endpoints.v1_routers import router as v1_router
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(v1_router)
handler = Mangum(app)
