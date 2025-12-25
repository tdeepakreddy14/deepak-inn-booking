import pymongo
import os 
from dotenv import load_dotenv
load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_URI"))

DB = client["Inn"]

USERS = DB["users"]

ROOMS = DB["rooms"]

ROOM_BOOKING = DB["room_bookings"]

ROOM_INVENTORY = DB["room_inventory"]

