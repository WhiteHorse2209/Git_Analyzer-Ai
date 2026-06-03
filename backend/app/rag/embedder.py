from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

def embed(text):

    return model.encode(
        text
    ).tolist()

def store_chunks(chunks):

    for i, chunk in enumerate(chunks):

        collection.add(
            ids=[str(i)],
            documents=[
                chunk["content"]
            ],
            metadatas=[
                {
                    "file":
                    chunk["file"]
                }
            ]
        )