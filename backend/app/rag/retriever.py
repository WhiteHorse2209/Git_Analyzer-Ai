from app.rag.vector_store import collection

def retrieve(query):

    results = collection.query(
        query_texts=[query],
        n_results=5
    )

    return results