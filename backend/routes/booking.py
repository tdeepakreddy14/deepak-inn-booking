from fastapi import APIRouter, Depends, Query, HTTPException
from utlis.database import ROOMS, USERS, ROOM_BOOKING, ROOM_INVENTORY
from utlis.jwt import require_auth
from models.booking_schema import BookingResponse, BookingCreate, BookingUpdate
from datetime import datetime, timedelta, timezone
from bson import ObjectId


router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("/", dependencies=[Depends(require_auth)])
async def create_booking(payload: BookingCreate, user: dict = Depends(require_auth)):
    print(user,"user ID for bboking")
    user_id = user["user_id"]
    payload = payload.model_dump()
    # check room exists and availability for dates (basic)
    room = ROOMS.find_one({"_id": ObjectId(payload["room_id"])})
    if not room:
        return {"success": False, "error": "Room not found", "code": "NOT_FOUND"}


    room_availability = list(ROOM_INVENTORY.aggregate([
        {
            "$match": {
                "room_type_id": payload["room_id"],
                "rooms_available": {"$gt": 0}
            }
        },
        {
            "$project":{
                "_id": 1
            }
        }
    ]))
    if not room_availability:
        return {"success": False, "error": "Not available for booking", "code": "NOT_FOUND"}
    # naive availability check: bookings for room that overlap
    # overlap = ROOM_BOOKING.count_documents({
    #     "room_id": payload["room_id"],
    #     "status": {"$in": ["pending", "confirmed"]},
    #     "$or": [
    #         {"check_in": {"$lte": payload["check_out"]}, "check_out": {"$gte": payload["check_in"]}}
    #     ]
    # })
    # overlap = ROOM_BOOKING.count_documents({
    #     "room_id": payload["room_id"],                           # match room
    #     "status": {"$in": ["pending", "confirmed"]},             # active bookings
    #     "check_in": {"$lt": payload["check_out"]},               # existing starts before new ends
    #     "check_out": {"$gt": payload["check_in"]}                # existing ends after new starts
    # })
    # print(overlap, "OOOVVEEERRRLLLAAPPEEDDDD")
    # if overlap:
    #     return {"success": False, "error": "Room not available for selected dates", "code": "CONFLICT"}

    # calculate price (simple: nights * price)
    nights = (payload["check_out"] - payload["check_in"]).days
    if nights <= 0:
        return {"success": False, "error": "Invalid date range", "code": "VALIDATION_ERROR"}

    total_price = nights * float(room["price"])

    doc = {
        "room_id": payload["room_id"],
        "user_id": user_id,
        "check_in": payload["check_in"].isoformat(),
        "check_out": payload["check_out"].isoformat(),
        "type": payload["type"],
        "image": payload["image"],
        "guests": payload["guests"],
        "special_requests": payload.get("special_requests"),
        "total_price": total_price,
        "status": "confirmed",
        "created_at": datetime.utcnow()
    }
    res = ROOM_BOOKING.insert_one(doc)
    
    ROOM_INVENTORY.update_one(
        {
            "_id": room_availability[0]["_id"]
        },
        {
            "$inc": {
                "rooms_booked": 1,
                "rooms_available": -1
            }
        }
    )
    
    doc["id"] = str(res.inserted_id)
    del doc["_id"]
    return {"success": True, "message": "Booking created successfully", "data": doc}

@router.get("/", dependencies=[Depends(require_auth)])
async def list_bookings(status: str | None = None, page: int = 1, limit: int = 10, user: dict = Depends(require_auth)):

    now = datetime.now(timezone.utc)
    now_str = now.isoformat()
    ROOM_BOOKING.update_many(                       #to update status after checkout 
        {
            "check_out": {"$lt": now_str},  
            "status": {"$nin": ["completed", "cancelled"]}
        },
        {
            "$set": {"status": "completed", "updated_at": now}
        },
    )

    query = {}
    if user.get("role", "user") != "admin":
        query["user_id"] = user["user_id"]
    if status:
        query["status"] = status

    skip = (page - 1) * limit
    items = list(ROOM_BOOKING.find(query).skip(skip).limit(limit))
    total = ROOM_BOOKING.count_documents(query)
    for it in items:
        it["id"] = str(it["_id"])
        it.pop("_id", None)
    return {"success": True, "data": {"bookings": items, "pagination": {"page": page,"limit": limit,"total": total,"total_pages": (total+limit-1)//limit}}}



@router.get("/blocked_dates/{room_type}" , dependencies=[Depends(require_auth)])
async def blocked_dates(room_type: str):
    room_id = ROOMS.find_one(
        {"type":room_type},
        {"_id": 1}
    )
    room_availability = list(ROOM_INVENTORY.aggregate([
        {
            "$match": {
                "room_type_id": str(room_id["_id"]),
                "rooms_available":0
            }
        },
        {
            "$project":{
                "_id": 1
            }
        }
    ]))
    print(room_type,"Room_TYPE")
    if not room_availability:
        return {"success": True , "data": {"BlokedDates" : []} }
    dates = ROOM_BOOKING.find(
        {"type": room_type},
        {"_id": 0, "check_in": 1, "check_out": 1}
    ).to_list()
    dates_to_be_blocked = []
    for d in dates:
        start = d["check_in"]
        end = d["check_out"]

        # convert if string (ISO format)
        if isinstance(start, str):
            start = datetime.fromisoformat(start)
        if isinstance(end, str):
            end = datetime.fromisoformat(end)

        while start < end:   # exclude checkout
            dates_to_be_blocked.append(start.strftime("%Y-%m-%d"))
            start += timedelta(days=1)

    print(dates_to_be_blocked)
    return {"success": True , "data": {"BlokedDates" : dates_to_be_blocked} }

@router.get("/{booking_id}", dependencies=[Depends(require_auth)])
async def get_booking(booking_id: str, user: dict = Depends(require_auth)):
    b = ROOM_BOOKING.find_one({"_id": ObjectId(booking_id)})
    if not b:
        return {"success": False, "error": "Booking not found", "code": "NOT_FOUND"}
    if user.get("role","user") != "admin" and b["user_id"] != user["user_id"]:
        return {"success": False, "error": "Forbidden", "code": "FORBIDDEN"}
    b["id"] = str(b["_id"])
    b.pop("_id", None)
    return {"success": True, "data": b}



@router.put("/{booking_id}", dependencies=[Depends(require_auth)])
async def update_booking(booking_id: str, payload: BookingUpdate, user: dict = Depends(require_auth)):
    b = ROOM_BOOKING.find_one({"_id": ObjectId(booking_id)})
    if not b:
        return {"success": False, "error": "Booking not found", "code": "NOT_FOUND"}
    if user.get("role","user") != "admin" and b["user_id"] != user["user_id"]:
        return {"success": False, "error": "Forbidden", "code": "FORBIDDEN"}

    update_doc = {k:v for k,v in payload.model_dump().items() if v is not None}
    update_doc["updated_at"] = datetime.utcnow()
    ROOM_BOOKING.update_one({"_id": ObjectId(booking_id)}, {"$set": update_doc})
    new_b = ROOM_BOOKING.find_one({"_id": ObjectId(booking_id)})
    new_b["id"] = str(new_b["_id"])
    new_b.pop("_id", None)
    return {"success": True, "message": "Booking updated successfully", "data": new_b}

@router.put("/cancel_room/{booking_id}", dependencies=[Depends(require_auth)])
async def cancel_booking(booking_id: str, user: dict = Depends(require_auth)):
    b = ROOM_BOOKING.find_one({"_id": ObjectId(booking_id)})
    if not b:
        return {"success": False, "error": "Booking not found", "code": "NOT_FOUND"}
    if user.get("role","user") != "admin" and b["user_id"] != user["user_id"]:
        return {"success": False, "error": "Forbidden", "code": "FORBIDDEN"}
    
    ROOM_BOOKING.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": "canceled"}}
    )

    ROOM_INVENTORY.update_one(
        {
            "room_type_id": str(b["room_id"])
        },
        {
            "$inc": {
                "rooms_booked": -1,
                "rooms_available": 1
            }
        }
    )

    return {"success": True, "status": "canceled"}
