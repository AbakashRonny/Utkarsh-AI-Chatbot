from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Message(BaseModel):
    role:str
    content:str

class ChatRequest(BaseModel):
    messages:List[Message]

class SaveConversationRequest(BaseModel):
    conversation:List[dict]
    timestamp:str
    title: Optional[str] = None
    conversation_id: Optional[int] = None


