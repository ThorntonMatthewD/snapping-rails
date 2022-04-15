import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import datetime
import pytest
from typing import List

from src.routers.markers import get_thumbnail, Marker
from conftest import user_auth, test_client


def test_get_markers(test_client):
    response = test_client.get("/markers")

    assert response.status_code == 200

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

def test_get_markers_limit(test_client):
    "Whenever we call GET /markers?limit=X, then we get <=X markers"

    limit = 10

    response = test_client.get(f"/markers?limit={limit}")

    assert response.status_code == 200

    assert len(response.json()) <= limit


def test_get_markers_by_user(test_client):
    "Whenever we call GET /markers?author_id=X then we only get posts by X"

    author_id = 1

    response = test_client.get(f"/markers?author_id={author_id}")

    assert response.status_code == 200

    for post in response.json():
        assert post.get("author_id") == author_id


def test_post_markers_bad_latitude(test_client):
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

    response = test_client.post("/markers", json.dumps(bad_long_data))

    assert response.status_code == 422

    assert response.json()['detail'][0]['msg'] == "Latitude value isn't valid"


def test_post_markers_bad_longitude(test_client):
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

    response = test_client.post("/markers", json.dumps(bad_lat_data))

    assert response.status_code == 422

    assert response.json()['detail'][0]['msg'] == "Longitude value isn't valid"


def test_post_markers_future_timestamp(test_client):
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

    response = test_client.post("/markers", json.dumps(future_post_data))

    assert response.status_code == 422

    assert response.json()['detail'][0]['msg'] == "You are posting from the future... Curious."


def test_get_thumbnail_good_url():
    "Whenever we call get_thumbnail with a URL that has a valid og:image tag then extract it"

    og_url = get_thumbnail("https://github.com/ThorntonMatthewD")

    assert og_url == "https://avatars.githubusercontent.com/u/44626690?v=4?s=400"


def test_get_thumbnail_bad_url():
    "Whenever we call get_thumbnail with a URL that does not have a valid og:image tag then it returns default"

    og_url = get_thumbnail("http://info.cern.ch/")

    assert og_url == "https://i.imgur.com/BfGDSZT.png"


test_marker = {
    "created_at": "2022-04-11T00:59:44.817Z",
    "lat": "35.321",
    "long": "90.444",
    "media_url": "https://github.com/ThorntonMatthewD/snapping-rails",
    "title": "The Can I Will Kick Around",
    "description": "This poor marker has no idea what's coming",
    "marker_type": 1
}


def marker_with_title_in_result(markers: List[dict], title: str) -> bool:
    return any(m.get("title", "") == title for m in markers)


def test_full_marker_lifecycle(user_auth, test_client):
    "POST a marker, update it, then delete it"
    #
    # Get list of markers and make sure the test_marker isn't there
    #
    initial_get_resp = test_client.get("/markers")
    assert initial_get_resp.status_code == 200
    #The title should not be present yet.
    assert not marker_with_title_in_result(
        markers=initial_get_resp.json(), 
        title="The Can I Will Kick Around"
    )

    #
    # POST test_marker. Seal its fate.
    #
    post_resp = test_client.post(
        "/markers", 
        json.dumps(test_marker), 
        cookies=user_auth.get("cookie_jar"),
        headers={"X-CSRF-TOKEN": user_auth.get("csrf_access_token")}
    )
    assert post_resp.status_code == 201
    assert post_resp.json()['detail'] == "Marker successfully added."

    #
    # Get test_marker to see if it was saved properly
    #
    after_post_get_resp = test_client.get("/markers")
    assert after_post_get_resp.status_code == 200
    #The title should now be in our response
    assert marker_with_title_in_result(
        markers=after_post_get_resp.json(), 
        title="The Can I Will Kick Around"
    )

    #
    # Update marker
    #
    updated_description = "Have you had enough yet?"
    updated_marker_data = test_marker
    updated_marker_data["id"] = max([marker["id"] for marker in after_post_get_resp.json()])
    updated_marker_data["description"] = updated_description

    update_resp = test_client.put(
        "/markers", 
        json.dumps(updated_marker_data), 
        cookies=user_auth.get("cookie_jar"),
        headers={"X-CSRF-TOKEN": user_auth.get("csrf_access_token")}
    )
    assert update_resp.json()['detail'] == "Marker updated successfully."
    assert update_resp.status_code == 200
    
    #
    # Make sure marker was updated
    #
    after_put_get_resp = test_client.get(f"/markers?post_id={updated_marker_data['id']}")
    assert after_put_get_resp.status_code == 200
    assert marker_with_title_in_result(
        markers=after_put_get_resp.json(), 
        title="The Can I Will Kick Around"
    )
    assert after_put_get_resp.json()[0]["description"] == updated_description

    #
    # Delete the marker, relinquishing it from its torment (until the next CI run :^])
    #
    delete_resp = test_client.request(
        method="DELETE",
        url="/markers", 
        data=json.dumps(updated_marker_data), 
        cookies=user_auth.get("cookie_jar"),
        headers={"X-CSRF-TOKEN": user_auth.get("csrf_access_token")}
    )
    assert delete_resp.json()['detail'] == "Marker deleted successfully."
    assert delete_resp.status_code == 200

    #
    # RIP test_marker 🌹🪦🌹  He lived a hard, but short life.
    #
    after_delete_get_resp = test_client.get("/markers")
    assert after_delete_get_resp.status_code == 200
    assert not marker_with_title_in_result(
        markers=after_delete_get_resp.json(), 
        title="The Can I Will Kick Around"
    )


def test_marker_model_latitude_validation():

    test_subject = Marker(**test_marker)

    with pytest.raises(Exception):
        test_subject.validate_lat_bounds(-100)

    with pytest.raises(Exception):
        test_subject.validate_lat_bounds(1000)

    with pytest.raises(Exception):
        test_subject.validate_lat_bounds(-223.4123)

    assert test_subject.validate_lat_bounds(-89.99999) == -89.99999
    assert test_subject.validate_lat_bounds(89.99999) == 89.99999
    assert test_subject.validate_lat_bounds(0) == 0
    assert test_subject.validate_lat_bounds(45.12) == 45.12
    assert test_subject.validate_lat_bounds(-29.41) == -29.41


def test_marker_model_longitude_validation():

    test_subject = Marker(**test_marker)

    with pytest.raises(ValueError):
        test_subject.validate_long_bounds(-190)

    with pytest.raises(ValueError):
        test_subject.validate_long_bounds(1000)

    with pytest.raises(ValueError):
        test_subject.validate_long_bounds(-223.4123)

    assert test_subject.validate_long_bounds(-179.99999) == -179.99999
    assert test_subject.validate_long_bounds(179.99999) == 179.99999
    assert test_subject.validate_long_bounds(0) == 0
    assert test_subject.validate_long_bounds(45.12) == 45.12
    assert test_subject.validate_long_bounds(-29.41) == -29.41


def test_marker_model_created_at_validation():

    test_subject = Marker(**test_marker)

    future_time = datetime.datetime.now() + datetime.timedelta(days=1)
    current_time = datetime.datetime.now()
    release_date_of_shrek = datetime.datetime.strptime('Apr 22 2001  12:00PM', '%b %d %Y %I:%M%p')

    with pytest.raises(ValueError):
        test_subject.validate_created_at_time(future_time)

    assert test_subject.validate_created_at_time(current_time) == current_time
    assert test_subject.validate_created_at_time(release_date_of_shrek) == release_date_of_shrek
