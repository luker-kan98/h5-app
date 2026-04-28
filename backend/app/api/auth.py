from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.dependencies import get_db
from app.i18n import t
from app.models.user import User
from app.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, language: Optional[str] = Query(None), db: Session = Depends(get_db)):
    user = User(username=req.username, password=hash_password(req.password))
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=t("username_exists", language))
    return TokenResponse(access_token=create_access_token(user.id, user.username))


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, language: Optional[str] = Query(None), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail=t("invalid_credentials", language))
    return TokenResponse(access_token=create_access_token(user.id, user.username))
