import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, Request

load_dotenv()

ALGO = "HS256"

def create_access_token(payload: dict, expires_minutes: int | None = None) -> str:
    exp = datetime.utcnow() + timedelta(minutes=(expires_minutes or int(os.getenv("JWT_EXPIRE_MINUTES", 60))))
    data = payload.copy()
    data.update({"exp": exp})
    return jwt.encode(data, os.getenv("JWT_SECRET"), algorithm=ALGO)

def decode_jwt(token: str) -> dict | None:
    try:
        data = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=[ALGO])
        return data
    except jwt.ExpiredSignatureError:
        return None
    except Exception:
        return None
    

async def require_auth(request: Request):
    token = request.headers.get("Authorization")

    if not token:
        raise HTTPException(401, "Authorization header missing")

    token = token.replace("Bearer ", "")
    user = decode_jwt(token)

    if not user:
        raise HTTPException(401, "Invalid or expired token")

    return user

async def require_admin(user = Depends(require_auth)):
    if user["role"] != "admin":
        raise HTTPException(403, "Admin access required")

    return user