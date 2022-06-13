from datetime import datetime, timezone, date
import opengraph_py3 as opengraph
import pytz

from fastapi import Depends, HTTPException, status, APIRouter, Query
from async_fastapi_jwt_auth import AuthJWT

from pydantic import BaseModel, validator, HttpUrl
from sqlalchemy.sql.expression import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from src.routers.auth import get_user
from src.database.database import get_session
from src.database import models


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

    @validator("lat")
    def validate_lat_bounds(cls, v):
        if float(v) < -90 or float(v) > 90:
            raise ValueError("Latitude value isn't valid")
        return v

    @validator("long")
    def validate_long_bounds(cls, v):
        if float(v) < -180 or float(v) > 180:
            raise ValueError("Longitude value isn't valid")
        return v

    @validator("created_at")
    def validate_created_at_time(cls, v):
        timestamp_as_utc = v.astimezone(pytz.utc)
        if timestamp_as_utc > datetime.now(timezone.utc):
            raise ValueError("You are posting from the future... Curious.")
        return v


def get_thumbnail(source_url: str) -> str:
    try:
        media = opengraph.OpenGraph(url=source_url, features="html.parser")
        if media.is_valid():
            img_url = media.get("image", None)
            if img_url is not None:
                return img_url
    except:
        return "https://i.imgur.com/BfGDSZT.png"

    return "https://i.imgur.com/BfGDSZT.png"


@router.get("/markers", tags=["Map"])
async def get_railmap_markers(
    marker_type: Optional[int] = Query(None, ge=1, le=5),
    newer_than: Optional[date] = None,
    older_than: Optional[date] = None,
    author_id: Optional[int] = Query(None, ge=1),
    author: Optional[str] = None,
    post_id: Optional[int] = None,
    limit: Optional[int] = Query(None, ge=1, le=1000),
    db_session: AsyncSession = Depends(get_session),
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

    if not author is None:
        user_info = await get_user(author)
        id = user_info.get("id")

        if not id is None:
            sql = sql.where(models.Marker.author_id == id)

    if not post_id is None:
        sql = sql.where(models.Marker.id == post_id)

    if not limit is None:
        sql = sql.limit(limit)
    else:
        sql = sql.limit(1000)

    data = await db_session.execute(sql)

    results = data.cursor.fetchall()

    return results


@router.post("/markers", status_code=status.HTTP_201_CREATED, tags=["Map"])
async def add_railmap_markers(
    marker: Marker,
    Authorize: AuthJWT = Depends(),
    db_session: AsyncSession = Depends(get_session),
):
    await Authorize.jwt_required()

    current_user = await Authorize.get_jwt_subject()

    user_info = await get_user(current_user)

    new_marker = {
        "author_id": user_info.get("id"),
        "created_at": marker.created_at.replace(tzinfo=None),
        "lat": marker.lat.strip(),
        "long": marker.long.strip(),
        "media_url": marker.media_url.strip(),
        "title": marker.title.strip(),
        "description": marker.description.strip(),
        "marker_type": marker.marker_type,
        "img_url": get_thumbnail(marker.media_url),
    }

    db_session.add(models.Marker(**new_marker))

    return {"detail": "Marker successfully added."}


@router.put("/markers", tags=["Map"])
async def update_railmap_markers(
    marker: Marker,
    Authorize: AuthJWT = Depends(),
    db_session: AsyncSession = Depends(get_session),
):
    await Authorize.jwt_required()

    current_user_name = await Authorize.get_jwt_subject()
    current_user = await get_user(current_user_name)

    # Reformat time to be offset-naive
    marker.created_at = marker.created_at.replace(tzinfo=None)

    # TODO Allow for admins to update anything
    sql = update(models.Marker)
    sql = sql.values(**marker.dict())
    sql = sql.where(models.Marker.id == marker.id)
    sql = sql.where(models.Marker.author_id == current_user.get("id"))

    result = await db_session.execute(sql)

    if result.rowcount > 0 if result is not None else None:
        return {"detail": "Marker updated successfully."}
    else:
        raise HTTPException(
            401, "Either this marker doesn't exist, or you do not own it."
        )


@router.delete("/markers", tags=["Map"])
async def delete_railmap_markers(
    marker: Marker,
    Authorize: AuthJWT = Depends(),
    db_session: AsyncSession = Depends(get_session),
):
    await Authorize.jwt_required()

    current_user_name = await Authorize.get_jwt_subject()
    current_user = await get_user(current_user_name)

    # TODO Allow for admins to delete anything
    sql = delete(models.Marker)
    sql = sql.where(models.Marker.id == marker.id)
    sql = sql.where(models.Marker.author_id == current_user.get("id"))

    result = await db_session.execute(sql)

    if result.rowcount > 0:
        return {"detail": "Marker deleted successfully."}
    else:
        raise HTTPException(
            401, "Either this marker doesn't exist, or you do not own it."
        )
