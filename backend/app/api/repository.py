from fastapi import APIRouter
from app.models.repository_model import RepositoryRequest
from app.github.repo_analyzer import get_repo_details
from app.database.mongodb import db

router = APIRouter(
    prefix="/repository",
    tags=["Repository"]
)

@router.post("/analyze")
async def analyze_repository(
    data: RepositoryRequest
):

    repo_data = get_repo_details(
        data.repo_url
    )

    result = await db.repositories.insert_one(
        repo_data
    )

    repo_data["_id"] = str(
        result.inserted_id
    )

    return repo_data