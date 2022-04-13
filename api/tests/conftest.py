import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import pytest
import aioredis
import fakeredis
import fakeredis.aioredis

from src.app import app
from fastapi.testclient import TestClient


client = TestClient(app)
server = fakeredis.FakeServer()


@pytest.fixture(autouse=True)
def redis(mocker):
    """Mock Redis store"""
    mocker.patch.object(aioredis, 'from_url', new=fakeredis.FakeStrictRedis(server))


@pytest.fixture
def login_user():
    """"Login user with test credentials and return cookies for testing protected routes"""

    user_creds = {"username": "testguy", "password": "password1!"}

    auth_resp = client.post("/token", json.dumps(user_creds))

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
