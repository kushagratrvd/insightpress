from fastapi import APIRouter
from pydantic import BaseModel
from app.services.summarizer import summarizer_service
from app.services.sentiment import sentiment_service
from app.services.writing import writing_service

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/summarize")
async def summarize_text(request: TextRequest):
    try:
        summary = await summarizer_service.summarize(request.text)
        return {"summary": summary}
    except Exception as e:
        return {"summary": "Error analyzing text", "details": str(e)}

@router.post("/sentiment")
async def analyze_sentiment(request: TextRequest):
    try:
        sentiment = await sentiment_service.analyze(request.text)
        return {"sentiment": sentiment}
    except Exception as e:
        return {"sentiment": "Error", "details": str(e)}

@router.post("/generate_outline")
async def generate_outline(request: TextRequest):
    try:
        outline = await writing_service.generate_outline(request.text)
        return {"result": outline}
    except Exception as e:
        return {"result": "Error", "details": str(e)}

@router.post("/polish_content")
async def polish_content(request: TextRequest):
    try:
        polished = await writing_service.polish_content(request.text)
        return {"result": polished}
    except Exception as e:
        return {"result": "Error", "details": str(e)}

@router.post("/generate_suggestions")
async def generate_suggestions(request: TextRequest):
    try:
        suggestions = await writing_service.generate_suggestions(request.text)
        return {"result": suggestions}
    except Exception as e:
        return {"result": "Error", "details": str(e)}
