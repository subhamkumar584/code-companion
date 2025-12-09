from fastapi import APIRouter

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

@router.get("/")
def placeholder():
    return {"message": "Search endpoint placeholder — coming soon!"}
