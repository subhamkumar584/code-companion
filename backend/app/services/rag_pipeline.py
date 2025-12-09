"""
RAG Pipeline - Full functional version
Combines: embeddings, chunker, vector store, retriever, LLM
"""

from app.services.embeddings import get_embedding
from app.services.retriever import Retriever
from app.services.llm import generate_completion
from app.services.chunker import chunk_text

# Initialize retriever
retriever = Retriever()

def run_rag_pipeline(query: str) -> str:
    """
    1. Generate embedding for query
    2. Retrieve top-k relevant code chunks
    3. Pass retrieved context + query to LLM
    4. Return answer
    """

    # Step 1: Get embedding for query
    query_embedding = get_embedding(query)

    # Step 2: Retrieve top 3 similar code chunks
    top_chunks = retriever.get_top_k(query_embedding, k=3)

    # Combine retrieved text as context
    context_text = "\n\n".join([chunk[0] for chunk in top_chunks])

    # Step 3: Generate answer using LLM
    prompt = f"Use the following code context to answer the question:\n\n{context_text}\n\nQuestion: {query}\nAnswer:"
    answer = generate_completion(prompt)

    return answer
