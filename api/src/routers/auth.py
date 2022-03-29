import re

from fastapi import APIRouter, HTTPException, Depends
from async_fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from pydantic import BaseModel, validator, EmailStr
from typing import Optional
from sqlalchemy.sql.expression import select

from src.config import pwd_context
from src.config import AUTH_SECRET_KEY
from src.database.database import SNAPPING_RAILS_ENGINE as db
from src.database.database import REDIS
from src.database import models
from src.database.functions import SqlalchemyResult


router = APIRouter()


class Settings(BaseModel):
    authjwt_secret_key: str = AUTH_SECRET_KEY

    authjwt_denylist_enabled: bool = True
    authjwt_denylist_token_checks: set = {"access","refresh"}

    authjwt_token_location: set = {"cookies"}

class UserCreds(BaseModel):
    username: str
    password: str


class NewUser(BaseModel):
    id: Optional[int]
    username: str
    email: EmailStr
    disabled: bool | None = False
    password: str
    password2: str  # for confirmation

    @validator("username")
    def user_validation(cls, v):
        if len(v) <= 0 or len(v) > 16:
            raise ValueError("Username must be between 1-16 characters")

        assert v.isalnum(), "No special characters are allowed in username"
        return v

    @validator("password")
    def password_strength_check(cls, v):
        if len(v) < 8:
            raise ValueError("Your password needs to be at least 8 characters.")
        elif len(v) > 32:
            raise ValueError("Your password cannot be longer than 32 characters.")
        elif re.search(r"\d", v) is None:
            raise ValueError("You need at least one digit in your password.")
        elif re.search(r"[ !#$%&'()*+,-./[\\\]^_`{|}~" + r'"]', v) is None:
            raise ValueError(
                "You need at least one special character in your password."
            )
        return v

    @validator("password2")
    def passwords_match(cls, v, values, **kwargs):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords don't match")


@AuthJWT.load_config
def get_config():
    return Settings()


@AuthJWT.token_in_denylist_loader
async def check_if_token_in_denylist(decrypted_token):
    jti = decrypted_token['jti']
    return await REDIS.get(jti)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.get("hashed_password", "")):
        return False
    return user


async def get_user(username: str):
    sql = select(models.User).where(models.User.username == username)

    async with db.session() as session:
        data = await session.execute(sql)

    result = SqlalchemyResult(data).rows2dict()

    if len(result) == 0:
        raise HTTPException(404, "User not found")
    else:
        user_dict = result[0]

    return user_dict


@router.post("/token", tags=["Auth"])
async def login(user: UserCreds, Authorize: AuthJWT = Depends()):
    matching_user = await authenticate_user(user.username, user.password)

    if not matching_user:
        raise HTTPException(status_code=401, detail="Bad username or password")

    access_token = await Authorize.create_access_token(subject=user.username)
    refresh_token = await Authorize.create_refresh_token(subject=user.username)

    await Authorize.set_access_cookies(access_token)
    await Authorize.set_refresh_cookies(refresh_token)

    return {"detail": f"{user.username} was logged in successfully."}


@router.post("/refresh", tags=["Auth"])
async def refresh(Authorize: AuthJWT = Depends()):
    await Authorize.jwt_refresh_token_required()

    current_user = await Authorize.get_jwt_subject()
    new_access_token = await Authorize.create_access_token(subject=current_user)
    new_refresh_token = await Authorize.create_refresh_token(subject=current_user)

    #Revoke old refresh token to force use of new one.
    await REDIS.set((await Authorize.get_raw_jwt())['jti'], "true")

    await Authorize.set_access_cookies(new_access_token)
    await Authorize.set_refresh_cookies(new_refresh_token)

    return {"detail": "Access token successfully refreshed."}


@router.delete("/logout", tags=["Auth"])
async def logout(Authorize: AuthJWT = Depends()):
    await Authorize.jwt_required()

    await Authorize.unset_jwt_cookies()

    return {"detail": "See ya later! User was successfully logged out."}


@router.get("/user", tags=["Auth"])
async def get_user_info(Authorize: AuthJWT = Depends()):
    await Authorize.jwt_required()

    current_user = await Authorize.get_jwt_subject()

    user_info = await get_user(current_user)
    user_info.pop("hashed_password")
    return {"user_info": user_info}


@router.get("/profile", tags=["User"])
async def get_user_profile(username: str):
    return {"detail": username}


@router.post("/register", tags=["Auth"])
async def register_new_user(new_user: NewUser):
    register_user = {
        "username": new_user.username,
        "email": new_user.email,
        "hashed_password": pwd_context.hash(new_user.password),
    }

    async with db.session() as session:
        session.add(models.User(**register_user))
        await session.commit()

    return {"detail": f"Welcome, {new_user.username}!"}
