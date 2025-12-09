from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.chunker import chunk_text
from app.services.embeddings import get_embedding
from app.services.vector_store import VectorStore
import os
import uuid

router = APIRouter(
    prefix="/upload",
    tags=["Code Upload"]
)

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

vector_store = VectorStore()

@router.post("/")
async def upload_code(file: UploadFile = File(...)):
    """
    Upload a code file (.py, .js, etc.) or zip.
    Chunks, generates embeddings, and stores in vectorstore.
    """

    # Save uploaded file
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Read file content
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()

    # Chunk the text
    chunks = chunk_text(text)

    # Generate embeddings and store
    for idx, chunk in enumerate(chunks):
        chunk_id = f"{file_id}_{idx}"
        embedding = get_embedding(chunk)
        vector_store.add_vector(chunk_id, chunk, embedding)

    return {
        "message": f"File '{file.filename}' uploaded and processed successfully!",
        "chunks_added": len(chunks)
    }
