from fastapi import APIRouter
from app.models.repository_model import RepositoryRequest
from app.github.clone_repo import clone_repository

router = APIRouter(
    prefix="/clone",
    tags=["Clone"]
)

@router.post("/")
def clone_repo(
    data: RepositoryRequest
):

    path = clone_repository(
        data.repo_url
    )

    return {
        "repo_path": path
    }