from fastapi import APIRouter
from app.rag.retriever import retrieve

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

@router.get("/{query}")
def search(query: str):

    results = retrieve(query)

    return results