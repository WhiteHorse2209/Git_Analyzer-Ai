import chromadb
import uuid

client = chromadb.PersistentClient(
    path="vector_db"
)

collection = client.get_or_create_collection(
    name="repositories"
)

def store_chunks(chunks, repo_name):
    """
    Stores all document chunks in batches. 
    Clears previous data for the same repo to ensure fresh indexing.
    """
    if not chunks:
        return

    # Delete existing entries for this repo to avoid duplicates/stale data
    try:
        collection.delete(where={"repo_name": repo_name})
    except:
        pass

    ids = []
    documents = []
    metadatas = []

    for chunk in chunks:
        ids.append(str(uuid.uuid4()))
        documents.append(chunk["content"])
        metadatas.append({
            "file": chunk["file"],
            "repo_name": repo_name
        })

    # Add in batches of 100 to avoid any payload limits
    batch_size = 100
    for i in range(0, len(ids), batch_size):
        collection.add(
            ids=ids[i:i+batch_size],
            documents=documents[i:i+batch_size],
            metadatas=metadatas[i:i+batch_size]
        )

def retrieve(question, repo_name=None):
    """
    Retrieves a broad set of relevant document chunks for deep analysis.
    """
    where_filter = {"repo_name": repo_name} if repo_name else None
    
    results = collection.query(
        query_texts=[question],
        n_results=25, # Increased significantly for better "whole-repo" understanding
        where=where_filter
    )
    return results
