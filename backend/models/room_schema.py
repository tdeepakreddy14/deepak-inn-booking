from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class RoomBase(BaseModel):
    # type: str
    # price: float
    # description: Optional[str]
    # amenities: Optional[List[str]]
    # max_guests: int
    # has_ac: bool
    # image_url: Optional[str]
    # available: bool
    type: str
    image: str
    price: float
    capacity: int
    hasAC: bool
    hasWifi: bool
    description: str
    longDescription: Optional[str]
    amenities: Optional[List[str]]
    size: Optional[str]
    available: bool
    roomCount: int
    
    

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseModel):
    # type: Optional[str]
    # price: Optional[float]
    # description: Optional[str]
    # amenities: Optional[List[str]]
    # max_guests: Optional[int]
    # has_ac: Optional[bool]
    # image_url: Optional[HttpUrl]
    # available: Optional[bool]
    type: str
    image: str
    price: float
    capacity: int
    hasAC: bool
    hasWifi: bool
    description: str
    longDescription: Optional[str]
    amenities: Optional[List[str]]
    size: Optional[str]
    roomCount : int
    available: bool

class RoomResponse(RoomBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    
class RommInventory(BaseModel):
    room_type_id: str
    date: datetime
    rooms_booked: int
    rooms_available: int