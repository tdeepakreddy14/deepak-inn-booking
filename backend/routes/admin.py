from fastapi import APIRouter, Depends, HTTPException, Query
from utlis.database import ROOM_BOOKING, ROOMS, USERS
from utlis.jwt import require_auth, require_admin
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats", dependencies=[Depends(require_admin)])
async def get_stats():
    total_rooms = ROOMS.count_documents({})
    available_rooms = ROOMS.count_documents({"available": True})
    total_bookings = ROOM_BOOKING.count_documents({})
    active_bookings = ROOM_BOOKING.count_documents({"status": {"$in": ["pending", "confirmed"]}})
    total_users = USERS.count_documents({})

    # --- Simple revenue calculation (NO PIPELINE) ---
    confirmed_and_completed = list(
        ROOM_BOOKING.find(
            {"status": {"$in": ["confirmed", "completed"]}}
        )
    )

    total_revenue = sum(float(b.get("total_price", 0)) for b in confirmed_and_completed)

    # --- Monthly revenue (last 30 days) ---
    since = datetime.utcnow() - timedelta(days=30)
    recent_bookings = list(
        ROOM_BOOKING.find(
            {
                "status": {"$in": ["confirmed", "completed"]},
                "created_at": {"$gte": since}
            }
        )
    )

    monthly_revenue = sum(float(b.get("total_price", 0)) for b in recent_bookings)

    occupancy_rate = (active_bookings / total_rooms * 100) if total_rooms else 0

    return {
        "success": True,
        "data": {
            "total_rooms": total_rooms,
            "available_rooms": available_rooms,
            "total_bookings": total_bookings,
            "active_bookings": active_bookings,
            "total_users": total_users,
            "total_revenue": float(total_revenue),
            "monthly_revenue": float(monthly_revenue),
            "occupancy_rate": occupancy_rate
        }
    }


@router.get("/users", dependencies=[Depends(require_admin)])
async def list_users(page: int = 1, limit: int = 20, role: str | None = None):
    query = {}
    if role:
        query["role"] = role

    skip = (page - 1) * limit

    users = list(USERS.find(query).skip(skip).limit(limit))
    total = USERS.count_documents(query)

    for u in users:
        u["id"] = str(u["_id"])
        u.pop("_id", None)
        u.pop("password", None)

    return {
        "success": True,
        "data": {
            "users": users,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit
            }
        }
    }

@router.put("/users/{user_id}/role", dependencies=[Depends(require_admin)])
async def update_role(user_id: str, payload: dict):
    # payload example: {"role": "admin"}
    role = payload.get("role")
    USERS.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": role, "updated_at": datetime.utcnow()}}
    )

    return {
        "success": True,
        "message": "User role updated successfully"
    }