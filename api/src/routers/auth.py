from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.sql.expression import select
from jose import JWTError, jwt
from pydantic import BaseModel, validator, EmailStr
from typing import Optional

from src.config import oauth2_scheme, pwd_context
from src.config import AUTH_SECRET_KEY, AUTH_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from src.database.database import SNAPPING_RAILS_ENGINE as db
from src.database import models
from src.database.functions import SqlalchemyResult


router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    id: Optional[int]
    username: str
    email: EmailStr
    disabled: bool | None = False


class UserInDB(User):
    username: str
    hashed_password: str


class NewUser(User):
    password: str
    password2: str #for confirmation

    @validator('username')
    def user_validation(cls, v):
        if len(v) <= 0 or len(v) > 16:
            raise ValueError("Username must be between 1-16 characters")

        assert v.isalnum(), "No special characters are allowed in username"
        return v

    @validator('password')
    def password_strength_check(cls, v):
        if len(v) < 8:
            raise ValueError("Your password needs to be at least 8 characters.")
        elif len(v) > 32:
            raise ValueError("Your password cannot be longer than 32 characters.")
        return v

    @validator('password2')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError("Passwords don't match")
        return v


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user(username: str):
    sql = select(models.User).where(models.User.username == username)

    async with db.session() as session:
        data = await session.execute(sql)

    result = SqlalchemyResult(data).rows2dict()

    if len(result) == 0:
        raise HTTPException(404, "User not found")
    else:
        user_dict = result[0]

    return UserInDB(**user_dict)


async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, AUTH_SECRET_KEY, algorithm=AUTH_ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, AUTH_SECRET_KEY, algorithms=[AUTH_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.post("/register")
async def register_new_user(new_user: NewUser):
    register_user = {
        "username": new_user.username,
        "email": new_user.email,
        "hashed_password": pwd_context.hash(new_user.password),
    }

    async with db.session() as session:
        session.add(models.User(**register_user))
        await session.commit()

    return {"message": f"Welcome, {new_user.username}!"}
