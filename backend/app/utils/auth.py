from fastapi import APIRouter
from app.database.mongodb import db
from app.models.user_model import UserRegister
from app.utils.hash import hash_password

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
async def register(
    user: UserRegister
):

    existing_user = await db.users.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "message":
            "Email already exists"
        }

    user_data = {
        "name": user.name,
        "email": user.email,
        "password":
        hash_password(user.password)
    }

    await db.users.insert_one(
        user_data
    )

    return {
        "message":
        "User registered successfully"
    }