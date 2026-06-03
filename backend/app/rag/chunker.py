def chunk_documents(docs, chunk_size=1200, chunk_overlap=200):
    """
    Chunks documents with overlap for better context preservation in RAG.
    """
    chunks = []
    for doc in docs:
        content = doc["content"]
        if not content:
            continue
            
        start = 0
        while start < len(content):
            end = start + chunk_size
            chunk_content = content[start:end]
            
            chunks.append({
                "file": doc["file"],
                "content": chunk_content
            })
            
            if end >= len(content):
                break
            start += (chunk_size - chunk_overlap)
            
    return chunks
