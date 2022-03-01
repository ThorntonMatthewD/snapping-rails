
from src.config import app
from src.routers import (auth)

app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Snapping Rails!"}