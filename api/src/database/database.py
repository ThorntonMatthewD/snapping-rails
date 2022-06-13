import aioredis
import logging

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import NullPool

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URI, REDIS_URL

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.DEBUG)


class Engine:
    def __init__(self):
        self.engine = create_async_engine(DATABASE_URI, poolclass=NullPool)
        self.session = sessionmaker(
            class_=AsyncSession,
            autoflush=True,
            bind=self.engine,
        )


SNAPPING_RAILS_ENGINE = Engine()


async def get_session() -> AsyncGenerator:
    async with SNAPPING_RAILS_ENGINE.session() as session:
        yield session


REDIS = aioredis.from_url(REDIS_URL, decode_responses=True)
