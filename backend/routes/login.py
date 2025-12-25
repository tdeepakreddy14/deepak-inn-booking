from fastapi import APIRouter, Body, Depends, HTTPException
from models.user_schema import UserCreate, UserLogin, UserResponse
from utlis.database import USERS
from utlis.hash import hash_password, verify_password
from utlis.jwt import create_access_token, require_auth
from datetime import datetime

router = APIRouter()


@router.post("/register")
async def register(payload: UserCreate):
    payload = payload.model_dump()
    # check existing
    if USERS.find_one({"email": payload["email"]}):
        return {"success": False, "error": "User already exists", "code": "CONFLICT"}

    doc = {
        "email": payload["email"],
        "password": hash_password(payload["password"]),
        "full_name": payload.get("full_name"),
        "phone": payload.get("phone"),
        "role": "user",
        "created_at": datetime.utcnow(),
    }
    res = USERS.insert_one(doc)
    user_id = str(res.inserted_id)
    # token = create_access_token({"user_id": user_id, "email": doc["email"], "role": doc["role"]})
    del doc["_id"]
    doc_out = {**doc, "id": user_id}
    del doc_out["password"]
    return {"success": True, "data": {"user": doc_out, "session": {"access_token": True}}}



@router.post("/login")
async def login(payload: UserLogin):
    email = payload.email
    password = payload.password
    user = USERS.find_one({"email": email})
    if not user:
        return {"success": False, "error": "Invalid credentials", "code": "UNAUTHORIZED"}
    if not verify_password(password, user["password"]):
        return {"success": False, "error": "Invalid credentials", "code": "UNAUTHORIZED"}

    user_id = str(user["_id"])
    token = create_access_token({"user_id": user_id, "email": user["email"], "role": user.get("role", "user")})
    user_out = {k: v for k, v in user.items() if k != "password"}
    user_out["id"] = user_id
    user_out["_id"] = None
    return {"success": True, "data": {"user": user_out, "session": {"access_token": token}}}

@router.get("/profile", dependencies=[Depends(require_auth)])
async def profile(user: dict = Depends(require_auth)):
    u = USERS.find_one({"_id": user["user_id"]},{"_id": 0})
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "data": u}