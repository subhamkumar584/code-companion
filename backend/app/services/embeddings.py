from openai import OpenAI, OpenAIError
from app.config import settings

# Initialize Gemini client (OpenAI-compatible SDK)
client = OpenAI(
    api_key=settings.GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

EMBEDDING_MODEL = settings.EMBEDDING_MODEL  # "gemini-embedding-001"

def get_embedding(text: str) -> list[float]:
    """
    Generate embeddings for a single text chunk using Gemini.
    Handles quota or API key errors gracefully.
    """
    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text
        )
        return response.data[0].embedding

    except OpenAIError as e:
        if "insufficient_quota" in str(e):
            raise RuntimeError("Gemini quota exceeded — please upgrade your plan or reduce request size.")
        elif "invalid_api_key" in str(e):
            raise RuntimeError("Invalid Gemini API key — check your .env configuration.")
        else:
            raise RuntimeError(f"Gemini API error: {e}")
