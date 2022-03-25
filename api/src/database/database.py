import aioredis
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import QueuePool

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URI, REDIS_URL


class Engine:
    def __init__(self):
        self.engine = create_async_engine(
            DATABASE_URI, poolclass=QueuePool, pool_size=20
        )
        self.session = sessionmaker(
            class_=AsyncSession, autocommit=False, autoflush=False, bind=self.engine
        )


SNAPPING_RAILS_ENGINE = Engine()

REDIS = aioredis.from_url(REDIS_URL, decode_responses=True)
