from fastapi import Request
from fastapi.responses import JSONResponse
from async_fastapi_jwt_auth.exceptions import AuthJWTException

from src.config import app


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})
