import pytest
import aioredis

import fakeredis
import fakeredis.aioredis

server = fakeredis.FakeServer()


@pytest.fixture(autouse=True)
def redis(mocker):
    """Mock Redis."""
    mocker.patch.object(aioredis, 'from_url', new=fakeredis.FakeStrictRedis(server))