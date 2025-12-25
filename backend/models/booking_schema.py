from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class BookingCreate(BaseModel):
    room_id: str
    check_in: datetime
    check_out: datetime
    type: str
    image: str
    guests: int
    special_requests: Optional[str] = None
    

class BookingUpdate(BaseModel):
    status: Optional[str]
    special_requests: Optional[str]

class BookingResponse(BaseModel):
    id: str
    room_id: str
    user_id: str
    check_in: date
    check_out: date
    guests: int
    total_price: float
    status: str
    special_requests: Optional[str]
    created_at: datetime