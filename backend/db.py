import os
import json
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, Text, DateTime, Integer, Boolean, text
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
from typing import Optional

load_dotenv()

# Database configuration
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Create database URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine
engine = create_engine(DATABASE_URL, echo=False)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


# ==============================
# Database Models
# ==============================

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    title = Column(String(255), default="New Conversation")
    is_public = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    conversation = Column(Text)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer)
    role = Column(String(50))  # 'user' or 'assistant'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.now)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


# ==============================
# Initialize Database
# ==============================

def init_db():
    """Initialize database tables"""
    try:
        print(f"Connecting to database: {DATABASE_URL.replace(DB_PASSWORD, '****')}")

        # Create tables
        Base.metadata.create_all(bind=engine)
        print("[OK] Database tables initialized successfully")

        # Test connection
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()

        print("[OK] Database connection test passed")

    except Exception as e:
        print(f"[ERROR] initializing database: {e}")
        import traceback
        traceback.print_exc()


# ==============================
# Get DB Session
# ==============================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==============================
# Save Conversation
# ==============================

def save_conversation_to_db(timestamp: str, conversation: list, user_id: Optional[int] = None, title: Optional[str] = None, conversation_id: Optional[int] = None):
    """Save or Update conversation in database. Returns ID or False."""
    db = None
    try:
        db = SessionLocal()
        
        if conversation_id:
            conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
            if conv:
                conv.conversation = json.dumps(conversation)
                if title: conv.title = title
                db.commit()
                return conv.id

        conv = Conversation(
            user_id=user_id,
            title=title or (conversation[0]['content'][:50] if conversation else "New Chat"),
            conversation=json.dumps(conversation)
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
        return conv.id
    except Exception as e:
        print(f"[ERROR] Database error: {e}")
        if db: db.rollback()
        return False
    finally:
        if db: db.close()



# ==============================
# Get All Conversations
# ==============================

def get_all_conversations(user_id: Optional[int] = None):
    """Retrieve all conversations from database"""
    try:
        db = SessionLocal()

        query = db.query(Conversation)
        if user_id:
            query = query.filter(Conversation.user_id == user_id)
            
        conversations = query.order_by(Conversation.timestamp.desc()).all()

        db.close()

        return conversations

    except Exception as e:
        print(f"Error retrieving conversations: {e}")
        return []


# ==============================
# Get Conversation By ID
# ==============================

def get_conversation_by_id(conv_id: int):
    """Retrieve specific conversation by ID"""
    try:
        db = SessionLocal()

        conversation = db.query(Conversation).filter(
            Conversation.id == conv_id
        ).first()

        db.close()

        return conversation

    except Exception as e:
        print(f"Error retrieving conversation: {e}")
        return None