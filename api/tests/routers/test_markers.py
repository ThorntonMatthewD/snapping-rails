import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import datetime
from src.app import app
from fastapi.testclient import TestClient


client = TestClient(app)


def test_get_markers():
    response = client.get("/markers")

    assert(response.status_code == 200)

    assert(
        response.json()[0] == {
            "id": 1,
            "created_at": "2022-03-01T16:27:36.119000",
            "lat": "41.980787905424904",
            "long": "-86.10896229743958",
            "media_url": "https://www.youtube.com/watch?v=b7IUr__Bpxk",
            "img_url": "https://i.ytimg.com/vi/b7IUr__Bpxk/maxresdefault.jpg",
            "title": "110 mph amtrak in Dowagiac Michigan",
            "description": "110 mph amtrak in Dowagiac Michigan",
            "marker_type": 2,
            "ingested_at": "2022-03-01T16:32:16.541918",
            "author_id": 1
        }
    )

def test_get_markers_limit():
    "Whenever we call GET /markers?limit=X, then we get <=X markers"

    limit = 10

    response = client.get(f"/markers?limit={limit}")

    assert response.status_code == 200

    assert len(response.json()) <= limit


def test_post_markers_bad_latitude():
    "Whenever we call POST /markers with a bad latitude we should receive a 422 error"

    bad_long_data = {
        "created_at": "2022-04-11T00:59:44.817Z",
        "lat": "120.123", #This is too high
        "long": "-86.321",
        "media_url": "https://github.com/ThorntonMatthewD/snapping-rails",
        "title": "My Title",
        "description": "A good description",
        "marker_type": 1
    }

    response = client.post("/markers", json.dumps(bad_long_data))

    assert response.status_code == 422

    assert response.json()['detail'][0]['msg'] == "Latitude value isn't valid"


def test_post_markers_bad_longitude():
    "Whenever we call POST /markers with a bad longitude we should receive a 422 error"

    bad_lat_data = {
        "created_at": "2022-04-11T00:59:44.817Z",
        "lat": "35.321",
        "long": "-210.123", #This is too low
        "media_url": "https://github.com/ThorntonMatthewD/snapping-rails",
        "title": "My Title",
        "description": "A good description",
        "marker_type": 1
    }

    response = client.post("/markers", json.dumps(bad_lat_data))

    assert response.status_code == 422

    assert response.json()['detail'][0]['msg'] == "Longitude value isn't valid"


def test_post_markers_future_timestamp():
    "Whenever we call POST /markers with bad input we should receive a 422 error"

    future_time = datetime.datetime.now() + datetime.timedelta(days=1)
    future_epoch_timestamp = future_time.timestamp()

    future_post_data = {
        "created_at": future_epoch_timestamp,
        "lat": "35.321",
        "long": "90.444",
        "media_url": "https://github.com/ThorntonMatthewD/snapping-rails",
        "title": "My Title",
        "description": "A good description",
        "marker_type": 1
    }

    response = client.post("/markers", json.dumps(future_post_data))

    assert response.status_code == 422

    assert response.json()['detail'][0]['msg'] == "You are posting from the future... Curious."
