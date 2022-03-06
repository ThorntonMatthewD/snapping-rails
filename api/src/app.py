from starlette.responses import FileResponse

from src.config import app
from src.routers import auth, markers

app.include_router(auth.router)
app.include_router(markers.router)


@app.get("/")
async def root():
    return {"message": "Welcome to Snapping Rails!"}


@app.get("/favicon.ico")
async def favicon():
    return FileResponse("favicon.ico")
