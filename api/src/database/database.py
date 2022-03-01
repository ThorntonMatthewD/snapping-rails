from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import QueuePool

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from src.config import DATABASE_URI


class Engine():
    def __init__(self):
        self.engine = create_async_engine(DATABASE_URI, poolclass=QueuePool, pool_size=20)
        self.session = sessionmaker(self.engine, class_=AsyncSession, expire_on_commit=True)
