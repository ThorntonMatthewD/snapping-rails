import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import pytest
from fakeredis import aioredis as fakeaioredis
from fastapi.testclient import TestClient

from src.app import app
import src.routers.auth



@pytest.fixture(autouse=True)
def mock_redis_auth(monkeypatch):
    """Mock Redis connections pool in Auth Router"""
    monkeypatch.setattr(src.routers.auth, 'REDIS', fakeaioredis.FakeRedis())


@pytest.fixture
def test_client():
    """Returns a Starlette test API instance"""
    return TestClient(app)


@pytest.fixture
def login_user(test_client):
    """"Login user with test credentials and return cookies for testing protected routes"""

    user_creds = {"username": "testguy", "password": "password1!"}

    auth_resp = test_client.post("/token", json.dumps(user_creds))

    assert auth_resp.status_code == 200, "Couldn't log in the test user.. uh-oh."
    assert auth_resp.json() == {'detail': 'testguy was logged in successfully.'}

    return auth_resp


def get_cookie_value_by_name(cookie_jar, cookie_name: str) -> str:
    for cookie in cookie_jar:
        if cookie.name == cookie_name:
            return cookie.value

    return ""


@pytest.fixture
def user_auth(login_user) -> dict:
    """Places cookiejar, and CSRF tokens into a dict for easier access"""

    cookie_jar = login_user.cookies

    csrf_access_token = get_cookie_value_by_name(cookie_jar, "csrf_access_token")
    csrf_refresh_token = get_cookie_value_by_name(cookie_jar, "csrf_refresh_token")

    processed_user_auth = {
        "cookie_jar": cookie_jar,
        "csrf_access_token": csrf_access_token,
        "csrf_refresh_token": csrf_refresh_token
    }

    return processed_user_auth
