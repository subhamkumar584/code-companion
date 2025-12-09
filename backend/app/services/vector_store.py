import os
from pathlib import Path
import pickle

from app.config import Settings

settings = Settings()
VECTOR_STORE_PATH = Path(settings.VECTOR_DB_PATH)

# Ensure vectorstore folder exists
VECTOR_STORE_PATH.mkdir(parents=True, exist_ok=True)

class VectorStore:
    def __init__(self):
        self.store_file = VECTOR_STORE_PATH / "vectors.pkl"
        if self.store_file.exists():
            with open(self.store_file, "rb") as f:
                self.vectors = pickle.load(f)
        else:
            self.vectors = {}  # {id: {"text": str, "embedding": list}}

    def add_vector(self, id: str, text: str, embedding: list[float]):
        self.vectors[id] = {"text": text, "embedding": embedding}
        self._save()

    def _save(self):
        with open(self.store_file, "wb") as f:
            pickle.dump(self.vectors, f)

    def get_all(self):
        return self.vectors
