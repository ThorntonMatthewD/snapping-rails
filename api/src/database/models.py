from typing import Match
from sqlalchemy import Column, Integer, BigInteger, TIMESTAMP, Text, text
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()
metadata = Base.metadata

#Add schema models here