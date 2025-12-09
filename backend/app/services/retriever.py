import numpy as np
from typing import List, Tuple
from app.services.vector_store import VectorStore

class Retriever:
    def __init__(self):
        self.vs = VectorStore()

    def cosine_similarity(self, vec1, vec2) -> float:
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2) + 1e-8)

    def get_top_k(self, query_embedding: list[float], k: int = 3) -> List[Tuple[str, float]]:
        """
        Return top-k most similar code chunks
        """
        results = []
        for item in self.vs.get_all().values():
            score = self.cosine_similarity(query_embedding, item["embedding"])
            results.append((item["text"], score))
        
        # Sort by score descending
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:k]
