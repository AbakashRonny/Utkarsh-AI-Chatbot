from fastapi import FastAPI, Depends, HTTPException, status
from llm_config import llm
from fastapi.middleware.cors import CORSMiddleware
from model import ChatRequest, Message, SaveConversationRequest, UserCreate, UserLogin, Token, UserResponse
from db import init_db, save_conversation_to_db, get_all_conversations, get_conversation_by_id, get_db, User
from auth import verify_password, get_password_hash, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from sqlalchemy.orm import Session
import json
import os
from datetime import datetime, timedelta

app = FastAPI()

# Initialize database
init_db()


# ==============================
# CORS Configuration
# NOTE: allow_origins=["*"] is INVALID when allow_credentials=True.
# The browser blocks credentialed requests (with Authorization headers)
# if the server responds with a wildcard origin. Exact origins are required.
# ==============================
_BASE_ORIGINS = [
    # ✅ CONFIRMED production frontend URL (Vercel Dashboard verified)
    "https://utkarsh-sage-ten.vercel.app",
    # Per-deployment preview URL (also allow this)
    "https://utkarsh-7vkk1ch7o-abakashdas06-6704s-projects.vercel.app",
    # Local development
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# Allow adding extra origins via environment variable on Render
# e.g. FRONTEND_URL=https://your-custom-domain.com
_extra = os.getenv("FRONTEND_URL", "")
_ALLOWED_ORIGINS = _BASE_ORIGINS + [u.strip() for u in _extra.split(",") if u.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
)



@app.get("/")
def greetings():
    return "Hii my application got started."


# ==============================
# Auth Routes
# ==============================

@app.post("/api/signup", response_model=Token)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists."
            )
        # Secure pre-hashing is handled in get_password_hash
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": new_user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print("!!! SIGNUP ERROR:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Signup error (v2.0-FIX): {str(e)}")



@app.post("/api/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password, returns a JWT token"""
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently logged-in user's profile"""
    return current_user


@app.post("/chat")
async def chat(request: ChatRequest):

    # Add system instruction
    system_message = {
        "role": "system",
        "content": """
You are a highly professional AI assistant.

Always format responses using clean Markdown.

Rules:
- Use clear section headings with ## 
- Use bullet points where helpful
- Use tables where helpful
- Use numbered steps for processes
- Use code blocks with ``` for code
- Keep explanations structured and easy to read
- Avoid long unbroken paragraphs
"""
    }

    # Convert Pydantic objects to dict format
    formatted_messages = [system_message] + [
        {"role": msg.role, "content": msg.content}
        for msg in request.messages
    ]

    # Langfuse callback handler for prompt tracking
    from langfuse.callback import CallbackHandler
    langfuse_handler = CallbackHandler(
        secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
        public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
        host=os.getenv("LANGFUSE_BASE_URL", "https://cloud.langfuse.com")
    )

    # Pass full conversation to model
    response = llm.invoke(formatted_messages, config={"callbacks": [langfuse_handler]})

    return {"reply": response.content}


@app.post("/api/save-conversation")
async def save_conversation(request: SaveConversationRequest, current_user: User = Depends(get_current_user)):
    """Save or Update conversation for the current logged-in user"""
    try:
        print(f"Saving conversation status for user {current_user.id}")
        conv_id = save_conversation_to_db(
            request.timestamp, 
            request.conversation, 
            user_id=current_user.id,
            title=request.title,
            conversation_id=request.conversation_id
        )
        if conv_id:
            return {"success": True, "conversation_id": conv_id}
        else:
            return {"success": False, "error": "Failed to save to database"}
    except Exception as e:
        return {"success": False, "error": str(e)}



@app.get("/chathistory")
def chat_his(current_user: User = Depends(get_current_user)):
    """Retrieve conversations for the current user"""
    try:
        conversations = get_all_conversations(user_id=current_user.id)
        result = []
        for conv in conversations:
            result.append({
                "id": conv.id,
                "title": conv.title,
                "timestamp": conv.timestamp.isoformat() if conv.timestamp else None,
                "conversation": json.loads(conv.conversation) if isinstance(conv.conversation, str) else conv.conversation
            })
        return {"conversations": result, "total": len(result)}
    except Exception as e:
        return {"error": str(e), "conversations": []}


@app.get("/admin/all-chats")
def all_chats():
    """Demonstration: How to see EVERYONE'S chat history"""
    try:
        conversations = get_all_conversations() # No user_id filter
        result = []
        for conv in conversations:
            result.append({
                "id": conv.id,
                "user_id": conv.user_id,
                "title": conv.title,
                "timestamp": conv.timestamp.isoformat() if conv.timestamp else None,
                "conversation": json.loads(conv.conversation) if isinstance(conv.conversation, str) else conv.conversation
            })
        return {"conversations": result, "total": len(result)}
    except Exception as e:
        return {"error": str(e), "conversations": []}
