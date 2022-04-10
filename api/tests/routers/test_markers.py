import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from src.app import app


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