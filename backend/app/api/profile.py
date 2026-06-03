from fastapi import APIRouter, Header, HTTPException
from app.utils.jwt_handler import verify_token
from app.database.mongodb import db

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.get("/")
async def get_profile(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        token = authorization.split(" ")[1]
        payload = verify_token(token)
        
        if not payload or "email" not in payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        user = await db.users.find_one({"email": payload["email"]}, {"password": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Convert MongoDB ID to string
        user["_id"] = str(user["_id"])
        
        # Ensure history exists
        if "history" not in user:
            user["history"] = []

        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/add_history")
async def add_to_history(repo_data: dict, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = authorization.split(" ")[1]
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    await db.users.update_one(
        {"email": payload["email"]},
        {"$push": {"history": {
            "repo_url": repo_data.get("repo_url"),
            "repo_name": repo_data.get("repo_name"),
            "timestamp": repo_data.get("timestamp")
        }}}
    )
    return {"status": "history updated"}
