import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import datetime
import pytest
from typing import List

from src.routers.auth import 
from conftest import user_auth, test_client

def test_get_profile(test_client):
    response = test_client.get("/profile?=MattTBoy")

    assert response.status_code == 200

    assert(
        response.json()[0] == {
            "username":"MattTBoy",
            "social_links":{
                "youtube":"https://www.youtube.com/user/railcamp09",
                "facebook":"https://www.facebook.com/RailfanDanny/",
                "instagram":"https://www.instagram.com/tracey.c.green/"
            },
            "profile_pic_url":"https://i.kym-cdn.com/photos/images/facebook/001/046/902/f95.jpg",
            "profile_description":"Hi! My name is Matt, and I should not be allowed to have unsupervised access to a computer. Otherwise, websites like this one are created as a result."
        }
    )
