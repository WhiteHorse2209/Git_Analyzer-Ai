from fastapi import APIRouter
from app.github.read_repo import read_repository

router = APIRouter(
    prefix="/debug",
    tags=["Debug"]
)

@router.get("/files/{repo}")
def files(repo: str):

    docs = read_repository(
        f"repositories/{repo}"
    )

    return {
        "files": len(docs)
    }

from app.github.read_repo import read_repository
from app.rag.chunker import chunk_documents

@router.get("/chunks/{repo}")
def chunk_count(repo: str):

    docs = read_repository(
        f"repositories/{repo}"
    )

    chunks = chunk_documents(docs)

    return {
        "files": len(docs),
        "chunks": len(chunks)
    }

from app.rag.vector_store import collection

@router.get("/vectors")
def vector_count():

    return {
        "vectors": collection.count()
    }