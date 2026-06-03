from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.github.read_repo import read_repository
from app.rag.chunker import chunk_documents
from app.rag.vector_store import store_chunks, retrieve
from app.rag.chat_engine import ask_llm

router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)

class ChatRequest(BaseModel):
    question: str
    repo_name: Optional[str] = None

@router.get("/index/{repo}")
def index_repo(repo: str):
    try:
        docs = read_repository(f"repositories/{repo}")
        if not docs:
            raise HTTPException(status_code=404, detail="Repository content not found")

        chunks = chunk_documents(docs)
        
        # Store ALL chunks (increased limit to 5000 for deep indexing)
        # This ensures the entire repo logic is captured
        store_chunks(chunks[:5000], repo_name=repo)

        return {
            "status": "success",
            "files_analyzed": len(docs),
            "chunks_stored": min(len(chunks), 5000),
            "repo_name": repo
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
def chat(data: ChatRequest):
    try:
        # Retrieve context specific to the repo if provided
        results = retrieve(data.question, repo_name=data.repo_name)

        if not results or not results["documents"] or not results["documents"][0]:
            context = "No specific context found in the repository for this question."
        else:
            # Join top 25 chunks to give the LLM a massive context window
            context = "\n---\n".join(results["documents"][0])

        answer = ask_llm(data.question, context)

        return {
            "answer": answer,
            "repo_name": data.repo_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
