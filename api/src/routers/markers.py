from datetime import datetime, timezone, date

from fastapi import Depends, HTTPException, status, APIRouter, Query
import opengraph_py3 as opengraph
from pydantic import BaseModel, validator, HttpUrl
from sqlalchemy.sql.expression import insert, select, update
from typing import List, Optional

from src.routers.auth import User, get_current_active_user
from src.database.database import SNAPPING_RAILS_ENGINE as db
from src.database import models
from src.database.functions import SqlalchemyResult


router = APIRouter()


class Marker(BaseModel):
    id: Optional[int]
    created_at: datetime
    lat: str
    long: str
    media_url: HttpUrl
    title: str
    description: str
    marker_type: int

    @validator('lat')
    def validate_lat_bounds(cls, v):
        if float(v) < -90 or float(v) > 90:
            raise ValueError("Latitude value isn't valid")
        return v

    @validator('long')
    def validate_long_bounds(cls, v):
        if float(v) < -180 or float(v) > 180:
            raise ValueError("Longitude value isn't valid")
        return v

    @validator('created_at')
    def validate_created_at_time(cls, v):
        if v > datetime.now(timezone.utc):
            raise ValueError("You are posting from the future... Curious.")
        return v


def get_thumbnail(source_url: str) -> str:
    media = opengraph.OpenGraph(url=source_url, features="html.parser")
    if media.is_valid():
        img_url = media.get("image", None)
        if img_url is not None:
            return img_url

    return "https://i.imgur.com/BfGDSZT.png" 


@router.get("/markers", tags=["Map"])
async def get_railmap_markers(
    marker_type:    Optional[int] = Query(None, ge=1, le=5),
    newer_than:     Optional[date] = None,
    older_than:     Optional[date] = None,
    author_id:      Optional[int] = Query(None, ge=1),
    limit:          Optional[int] = Query(None, ge=1, le=1000)
):
    sql = select(models.Marker)

    if not marker_type is None:
        sql = sql.where(models.Marker.marker_type == marker_type)
    
    if not newer_than is None:
        sql = sql.where(models.Marker.created_at > newer_than)

    if not older_than is None:
        sql = sql.where(models.Marker.created_at < older_than)

    if not author_id is None:
        sql = sql.where(models.Marker.author_id == author_id)

    if not limit is None:
        sql = sql.limit(limit)
    else:
        sql = sql.limit(1000)

    async with db.session() as session:
        data = await session.execute(sql)

    data = SqlalchemyResult(data)

    return data.rows2dict()


@router.post("/markers", status_code=status.HTTP_201_CREATED, tags=["Map"])
async def add_railmap_markers(
    marker: Marker,
    current_user: User = Depends(get_current_active_user)
):
    new_marker = {
        "author_id": current_user.id,
        "created_at": marker.created_at.replace(tzinfo=None),
        "lat": marker.lat.strip(),
        "long": marker.long.strip(),
        "media_url": marker.media_url.strip(),
        "title": marker.title.strip(),
        "description": marker.description.strip(),
        "marker_type": marker.marker_type,
        "img_url": get_thumbnail(marker.media_url)
    }

    async with db.session() as session:
        session.add(models.Marker(**new_marker))
        await session.commit()

    return {"message": f"Marker successfully added."}


@router.put("/markers", tags=["Map"])
async def update_railmap_markers(
    marker: Marker, 
    current_user: User = Depends(get_current_active_user)
):
    #TODO Allow for admins to update anything
    async with db.session() as session:
        result = session.update(models.Marker) \
            .where(models.Marker.id == marker.id and models.Marker.author_id == current_user.id) \
            .values(marker)

        await session.commit()

    if result.rowcount > 0:
        return {"message": "Marker updated successfully."}
    else:
        raise HTTPException(401, "Either this marker doesn't exist, or you do not own it.")


@router.delete("/markers", tags=["Map"])
async def delete_railmap_markers(
    marker: Marker, 
    current_user: User = Depends(get_current_active_user)
):
    #TODO Allow for admins to delete anything
    async with db.session() as session:
        result = session.delete(models.Marker) \
            .where(models.Marker.id == marker.id and models.Marker.author_id == current_user.id) \
            .values(marker)

        await session.commit()

    if result.rowcount > 0:
        return {"message": "Marker deleted successfully."}
    else:
        raise HTTPException(401, "Either this marker doesn't exist, or you do not own it.")