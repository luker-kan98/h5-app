from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User

ANONYMOUS_USERNAME = "anonymous"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.username == ANONYMOUS_USERNAME).first()
    if user is None:
        user = User(username=ANONYMOUS_USERNAME, password="")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
