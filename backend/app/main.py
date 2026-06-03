from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.repository import router as repository_router
from app.api.clone import router as clone_router
from app.api.reader import router as reader_router
from app.api.rag import router as rag_router
from app.api.search import router as search_router
from app.api.debug import router as debug_router

app = FastAPI(title="GitAnalyzer AI")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(repository_router)
app.include_router(clone_router)
app.include_router(reader_router)
app.include_router(rag_router)
app.include_router(search_router)
app.include_router(debug_router)
app.include_router(auth_router)
app.include_router(profile_router)

@app.get("/")
def root():
    return {
        "message": "GitAnalyzer AI Running"
    }