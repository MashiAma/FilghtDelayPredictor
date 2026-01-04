from fastapi import APIRouter

router = APIRouter()

@router.post("/query")
def chat_query():
    return {"message": "AI chat query"}
