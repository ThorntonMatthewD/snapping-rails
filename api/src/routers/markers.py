from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status, APIRouter
from pydantic import BaseModel, validator, HttpUrl
from typing import List

from src.routers.auth import User, get_current_active_user
from src.database.database import SNAPPING_RAILS_ENGINE as db
from src.database import models
from src.database.functions import SqlalchemyResult


router = APIRouter()


class Marker(BaseModel):
    created_at: datetime
    lat: float
    long: float
    media_url: HttpUrl
    title: str
    description: str

    @validator('lat')
    def validate_lat_bounds(cls, v):
        if v < -90 or v > 90:
            raise ValueError("Latitude value isn't valid")
        return v

    @validator('long')
    def validate_long_bounds(cls, v):
        if v < -180 or v > 180:
            raise ValueError("Longitude value isn't valid")
        return v

    @validator('created_at')
    def validate_created_at_time(cls, v):
        if v > datetime.now(timezone.utc):
            raise ValueError("You are posting from the future... Curious.")
        return v


@router.get("/markers", tags=["Map"])
async def get_railmap_markers():
    pass


@router.post("/markers", status_code=status.HTTP_201_CREATED, tags=["Map"])
async def add_railmap_markers(
    markers: List[Marker],
    current_user: User = Depends(get_current_active_user)
):
    pass


@router.put("/markers", tags=["Map"])
async def update_railmap_markers(
    markers: List[Marker], 
    current_user: User = Depends(get_current_active_user)
):
    pass


@router.delete("/markers", tags=["Map"])
async def delete_railmap_markers(
    markers: List[Marker], 
    current_user: User = Depends(get_current_active_user)
):
    #Confirm user doing the deleting owns the markers for now
    #Admins/Mods will also be able to do this in the future.
    pass