from fastapi import FastAPI
from routes.admin import router as admin
from routes.booking import router as booking
from routes.login import router as login
from routes.rooms import router as rooms
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://your-frontend-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],           # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],           # allow all headers
)

app.include_router(admin)
app.include_router(booking)
app.include_router(login)
app.include_router(rooms)

