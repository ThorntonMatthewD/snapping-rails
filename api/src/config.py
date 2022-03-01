import os
import logging

from dotenv import find_dotenv, load_dotenv
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext


#System-wide Env Vars
load_dotenv(find_dotenv(), verbose=True)

DATABASE_URI = os.environ.get('DATABASE_URI')

AUTH_SECRET_KEY = os.environ.get('AUTH_SECRET_KEY')
AUTH_ALGORITHM = os.environ.get('AUTH_ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = float(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES') or 30)


app = FastAPI()

#CORS Setup
origins = [
    "http://snappingrails.com/",
    "https://snappingrails.com/",
    "http://www.snappingrails.com/",
    "https://www.snappingrails.com/",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")