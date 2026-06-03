from fastapi import APIRouter
from app.database.mongodb import db
from app.models.user_model import UserRegister, UserLogin
from app.utils.hash import hash_password, verify_password
from app.utils.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
async def register(user: UserRegister):

    existing_user = await db.users.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {"message": "Email already exists"}

    await db.users.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password)
    })

    return {"message": "User registered successfully"}


@router.post("/login")
async def login(user: UserLogin):

    existing_user = await db.users.find_one(
        {"email": user.email}
    )

    if not existing_user:
        return {"message": "User not found"}

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        return {"message": "Invalid password"}

    token = create_access_token(
        {"email": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }