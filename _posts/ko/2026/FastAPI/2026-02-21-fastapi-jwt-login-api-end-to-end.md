---
title: FastAPI + JWT 로그인 API 처음부터 끝까지 만들기 (실전 예제)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- FastAPI
tags:
- Python
- FastAPI
- JWT
- Authentication
- API
toc: true
toc_sticky: true
toc_label: 목차
description: FastAPI와 JWT로 회원가입, 로그인, 보호 라우트까지 한 번에 구현하는 실전 가이드. 초보자도 바로 따라 할 수 있는 구조와 코드 예제를 제공합니다.
article_tag1: FastAPI
article_tag2: JWT
article_tag3: Authentication
article_section: FastAPI
meta_keywords: FastAPI JWT 로그인, FastAPI 인증, JWT 토큰 인증, Python API 인증, FastAPI 튜토리얼
last_modified_at: '2026-02-21 12:00:00 +0900'
---

# FastAPI + JWT 로그인 API, 왜 이 조합이 가장 많이 쓰일까?

처음 인증 API를 만들 때 가장 많이 막히는 지점은 3가지입니다.

1. 비밀번호를 어떻게 안전하게 저장하지?
2. 로그인 상태를 서버가 어떻게 기억하지?
3. 보호된 API는 어디서 막아야 하지?

이 글은 이 3가지를 한 번에 해결합니다. 목표는 단순합니다. **회원가입 -> 로그인(JWT 발급) -> 내 정보 조회(보호 라우트)**까지 실제로 동작하는 API를 만드는 것입니다.

## 최종 결과 먼저 보기

완성 후에는 아래 흐름이 됩니다.

1. `POST /auth/signup` : 이메일/비밀번호로 계정 생성
2. `POST /auth/login` : 로그인 성공 시 `access_token` 발급
3. `GET /users/me` : 토큰이 있어야만 내 정보 조회 가능

JWT는 서버 세션 저장 없이 인증 상태를 전달할 수 있어, API 서버를 확장할 때 특히 유리합니다.

## 1) 프로젝트 세팅

### 폴더 구조

```bash
app/
  main.py
  db.py
  models.py
  schemas.py
  security.py
  deps.py
  routers/
    auth.py
    users.py
```

### 설치 패키지

```bash
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[email] pydantic
```

## 2) DB와 사용자 모델 만들기

### `app/db.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### `app/models.py`

```python
from sqlalchemy import Column, Integer, String
from .db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
```

## 3) 요청/응답 스키마 정의

### `app/schemas.py`

```python
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

## 4) 비밀번호 해시 + JWT 발급

### `app/security.py`

```python
from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

SECRET_KEY = "change-this-to-a-long-random-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
```

## 5) DB 의존성 + 현재 사용자 가져오기

### `app/deps.py`

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from .db import SessionLocal
from . import models
from .security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
```

## 6) 회원가입/로그인 라우터

### `app/routers/auth.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, schemas
from ..deps import get_db
from ..security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=schemas.UserOut)
def signup(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=user.email)
    return {"access_token": token, "token_type": "bearer"}
```

### `app/routers/users.py`

```python
from fastapi import APIRouter, Depends
from ..deps import get_current_user
from ..schemas import UserOut

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserOut)
def read_me(current_user = Depends(get_current_user)):
    return current_user
```

## 7) 앱 실행

### `app/main.py`

```python
from fastapi import FastAPI
from .db import Base, engine
from .routers import auth, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI JWT Auth Example")
app.include_router(auth.router)
app.include_router(users.router)
```

실행:

```bash
uvicorn app.main:app --reload
```

Swagger 접속: `http://127.0.0.1:8000/docs`

## 8) 실제 테스트 순서

1. `/auth/signup` 호출로 회원가입
2. `/auth/login` 호출 시 `username`에는 이메일 입력
3. 받은 `access_token`을 복사
4. Swagger 우측 상단 `Authorize`에서 `Bearer {token}` 입력
5. `/users/me` 호출해서 내 정보가 나오면 성공

## 초보자가 자주 하는 실수 4가지

1. 평문 비밀번호 저장: 반드시 해시로 저장해야 합니다.
2. `SECRET_KEY` 하드코딩 고정: 운영 환경에서는 반드시 환경변수로 분리하세요.
3. 만료시간 없음: `exp` 없는 토큰은 사고 확률이 높습니다.
4. 예외 응답 통일 안 함: 인증 실패 응답을 401로 일관되게 유지하세요.

## SEO/운영 관점에서 여기서 한 단계 더

- Refresh Token을 별도 라우트로 분리해 로그인 재요청 비용을 줄이기
- Redis 블랙리스트로 로그아웃 토큰 무효화 처리
- 역할(Role) 기반 권한(`admin`, `user`)으로 API 접근 제어

실무에서는 “로그인 성공”보다 “인증 실패를 얼마나 안전하게 처리하느냐”가 더 중요합니다.

## FAQ

### FastAPI JWT 로그인에서 Access Token 만으로 충분한가요?

초기 서비스는 Access Token만으로도 시작할 수 있습니다. 다만 장기적으로는 Refresh Token을 분리해 재로그인 빈도를 줄이는 구조가 운영에 유리합니다.

### JWT를 쓰면 서버에 세션 저장이 아예 필요 없나요?

기본 인증 자체는 무상태(stateless)로 처리할 수 있습니다. 하지만 로그아웃 강제, 토큰 폐기, 이상 탐지 같은 운영 기능에는 Redis 같은 저장소가 필요해질 수 있습니다.

### 비밀번호 검증은 왜 bcrypt를 쓰나요?

bcrypt는 느린 해시를 의도적으로 사용해 대입 공격 비용을 높입니다. 인증 시스템에서 가장 먼저 지켜야 할 최소 보안 기준에 가깝습니다.

## 마무리

처음 JWT 인증을 붙일 때는 복잡해 보이지만, 실제로는 **비밀번호 해시, 토큰 발급, 토큰 검증** 이 세 가지 축만 명확하면 됩니다. 오늘 예제를 그대로 한 번 완성해보면, 이후에는 소셜 로그인이나 권한 시스템도 훨씬 수월하게 확장할 수 있습니다.

처음 헤맸던 저처럼, 이 글이 지금 막 인증 API를 만들기 시작한 분에게 작은 길잡이가 되길 바랍니다.
