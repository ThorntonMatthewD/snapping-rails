from sqlalchemy import BigInteger, Boolean, Column, DateTime, SmallInteger, String, Text, text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Marker(Base):
    __tablename__ = 'markers'

    id = Column(BigInteger, primary_key=True, server_default=text("nextval('markers_id_seq'::regclass)"))
    created_at = Column(DateTime, nullable=False)
    lat = Column(String, nullable=False)
    long = Column(String, nullable=False)
    media_url = Column(String, nullable=False)
    img_url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    type = Column(SmallInteger, nullable=False)
    ingested_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))


class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True, server_default=text("nextval('users_id_seq'::regclass)"))
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(Text, nullable=False)
    disabled = Column(Boolean, server_default=text("false"))