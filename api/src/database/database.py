import aioredis
import logging

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import QueuePool

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URI, REDIS_URL

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.DEBUG)


class Engine:
    def __init__(self):
        self.engine = create_async_engine(
            DATABASE_URI, poolclass=QueuePool, pool_size=20
        )
        self.session = sessionmaker(
            class_=AsyncSession,
            autocommit=True,
            autoflush=True,
            expire_on_commit=False,
            bind=self.engine,
        )


SNAPPING_RAILS_ENGINE = Engine()


async def get_session() -> AsyncGenerator:
    session: AsyncSession = SNAPPING_RAILS_ENGINE.session()

    try:
        yield session
    finally:
        await session.close()


REDIS = aioredis.from_url(REDIS_URL, decode_responses=True)
