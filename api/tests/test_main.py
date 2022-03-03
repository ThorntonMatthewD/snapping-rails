
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from src.app import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_root_route():
    response = client.get("/")
    
    assert response.status_code == 200, f"Root route could need be reached. HTTP {response.status_code}"
    assert response.json() == {'message': 'Welcome to Snapping Rails!'}


def test_favicon_route():
    response = client.get("/favicon.ico")
    
    assert response.status_code == 200, f"Favicon route could need be reached. HTTP {response.status_code}"


if __name__ == "__main__":
  test_root_route()
  test_favicon_route()