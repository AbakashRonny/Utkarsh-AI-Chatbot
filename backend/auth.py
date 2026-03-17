import os
print(">>> DEBUG: AUTH MODULE LOADING")
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db import get_db, User
from model import TokenData

# Secret key for JWT. In a real app, this should be an environment variable.
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def verify_password(plain_password, hashed_password):
    # Bcrypt has a 72-byte limit. We truncate to 72 bytes safely.
    pwd_bytes = plain_password.encode('utf-8')[:72]
    safe_pwd = pwd_bytes.decode('utf-8', errors='ignore')
    # Extra safety: character truncation just in case passlib checks len()
    if len(safe_pwd) > 72: safe_pwd = safe_pwd[:72]
    return pwd_context.verify(safe_pwd, hashed_password)

def get_password_hash(password):
    # Bcrypt has a 72-byte limit.
    pwd_bytes = password.encode('utf-8')[:72]
    safe_pwd = pwd_bytes.decode('utf-8', errors='ignore')
    # Extra safety: character truncation just in case passlib checks len()
    if len(safe_pwd) > 72: safe_pwd = safe_pwd[:72]
    print(f">>> DEBUG: Hashing password ({len(safe_pwd.encode('utf-8'))} bytes)")
    return pwd_context.hash(safe_pwd)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user
