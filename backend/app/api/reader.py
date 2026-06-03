from fastapi import APIRouter
from app.github.read_repo import read_repository

router = APIRouter(
    prefix="/reader",
    tags=["Reader"]
)

@router.get("/{repo_name}")
def read_repo(repo_name: str):

    repo_path = f"repositories/{repo_name}"

    docs = read_repository(
        repo_path
    )

    return {
        "total_files": len(docs),
        "documents": docs[:5]
    }

@router.get("/count/{repo_name}")
def count_files(repo_name: str):

    docs = read_repository(
        f"repositories/{repo_name}"
    )

    return {
        "files": len(docs)
    }