from pydantic import BaseModel


class Register(BaseModel):
    email: str
    password: str
    number: int
    username: str