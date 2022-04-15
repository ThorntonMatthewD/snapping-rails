from conftest import test_client


def test_root_route(test_client):
    response = test_client.get("/")

    assert (
        response.status_code == 200
    ), f"Root route could need be reached. HTTP {response.status_code}"
    assert response.json() == {"detail": "Welcome to Snapping Rails!"}


def test_favicon_route(test_client):
    response = test_client.get("/favicon.ico")

    assert (
        response.status_code == 200
    ), f"Favicon route could need be reached. HTTP {response.status_code}"
