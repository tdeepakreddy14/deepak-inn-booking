from fastapi import APIRouter, Depends, Query ,HTTPException
from models.room_schema import RoomCreate, RoomUpdate, RommInventory
from utlis.database import ROOMS, ROOM_INVENTORY
from utlis.jwt import require_auth
from datetime import datetime, timezone
from utlis.jwt import require_admin
from bson import ObjectId

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])

@router.get("/" , dependencies=[Depends(require_auth)])
async def get_rooms(
    type: str | None = None,
    available: bool = True,
    min_price: float | None = None,
    max_price: float | None = None,
    page: int = 1,
    limit: int = 10
):
    query = {}

    if type:
        query["type"] = type
    if available is not None:
        query["available"] = available
    if min_price:
        query["price"] = {"$gte": min_price}
    if max_price:
        query.setdefault("price", {})["$lte"] = max_price
        
    skip = (page - 1) * limit
    pipeline = [
        # Group by the field you want to check duplicates on
        {
            "$group": {
                "_id": "$type",
                "count": {"$sum": 1},
                "firstDoc": {"$first": "$$ROOT"}  # captures the first matching document
            }
        },
        # Keep only groups where count > 1 (duplicates)
        # {"$match": {"count": {"$gt": 1}}},

        # Optionally return only the first document
        {"$project": {"firstDoc": 1}},
        {"$skip": skip},     # pagination inside pipeline
        {"$limit": limit}
    ]


    print(31, query)

    rooms = list(ROOMS.aggregate(pipeline))
    total = ROOMS.count_documents(query)
    data = []
    print(rooms)
    for room in rooms:
        room["firstDoc"]["id"] = str(room["firstDoc"]["_id"])
        del room["firstDoc"]["_id"]
        data.append(room["firstDoc"])
        # room["id"] = str(room["_id"])
        # del room["_id"]

    return {
        "success": True,
        "data": {
            "rooms": data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit
            }
        }
    }

@router.get("/{room_id}", dependencies=[Depends(require_auth)])
async def get_room(room_id: str):
    # Convert room_id string → ObjectId
    try:
        obj_id = ObjectId(room_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid room ID format")

    room = ROOMS.find_one({"_id": obj_id})
    if not room:
        return {"success": False, "error": "Room not found"}

    room["id"] = str(room["_id"])
    del room["_id"]

    return {"success": True, "data": room}

@router.post("/", dependencies=[Depends(require_admin)])
async def create_room(room: RoomCreate):
    doc = room.model_dump()
    doc["created_at"] = datetime.utcnow()
    doc["updated_at"] = datetime.utcnow()
    
    previous_room = ROOMS.find_one(
        {"type": doc["type"]}
    )
    if previous_room:
        return {"error": True, "message": "Room with the same type exist, please udpate it!"}
    
    result = ROOMS.insert_one(doc)
    del doc["_id"]
    
    inventory = RommInventory(
        room_type_id=str(result.inserted_id),
        date=datetime.now(timezone.utc),
        rooms_booked=0,
        rooms_available=doc["roomCount"]
    )
    
    ROOM_INVENTORY.insert_one(inventory.model_dump())
      
    
    # roomCount = doc.pop("roomCount")
    # for i in range(roomCount):
    #     ROOMS.insert_one(doc)
    #     del doc["_id"]
    

    # print(result.inserted_id, doc)
    return {
        "success": True,
        "message": "Room created successfully",
        "data": { **doc}
    }


@router.put("/{room_id}", dependencies=[Depends(require_admin)])
async def update_room(room_id: str, data: RoomUpdate):
    update_doc = {k: v for k, v in data.dict().items() if v is not None}
    update_doc["updated_at"] = datetime.utcnow()
    
    try:
        obj_id = ObjectId(room_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid room ID format")

    ROOMS.update_one(
        {"_id": obj_id},
        {"$set": update_doc}
    )

    return {"success": True, "message": "Room updated successfully"}

@router.delete("/{room_id}", dependencies=[Depends(require_admin)])
async def delete_room(room_id: str):
    
    try:
        obj_id = ObjectId(room_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid room ID format")
    
    room = ROOMS.find_one({"_id": obj_id})
    if not room:
        return {"error": True, "message": "Room not found"}

    ROOMS.delete_one({"_id": obj_id})
    return {"success": True, "message": "Room deleted successfully"}
    