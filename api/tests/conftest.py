import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from src.database.models import Base

import pytest


@pytest.fixture(scope="session")
def engine():
    "Create SQLAlchemy database engine"
    return create_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/snapping-rails")


@pytest.fixture
def dbsession(engine):
    "Yield db session, then clean up transaction after test"
    connection = engine.connect()
    transaction = connection.begin()

    session = Session(bind=connection)
    yield session
    session.close()

    transaction.rollback()
    connection.close()