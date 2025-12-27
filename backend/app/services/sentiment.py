import httpx
from app.core.config import settings
import random

class SentimentService:
    @staticmethod
    async def analyze(text: str) -> str:
        if not settings.AI_API_KEY or not settings.AI_API_URL:
            return "Neutral"

        try:
            headers = {
                "Authorization": f"Bearer {settings.AI_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "tngtech/tng-r1t-chimera:free",
                "messages": [
                    {"role": "system", "content": "Analyze the sentiment of this text. Return ONLY one word from this list: Positive, Negative, Neutral, Inspiring, Informative."},
                    {"role": "user", "content": text[:2000]}
                ]
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(settings.AI_API_URL, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                result = data['choices'][0]['message']['content'].strip()
                
                valid_sentiments = ["Positive", "Negative", "Neutral", "Inspiring", "Informative"]
                for word in valid_sentiments:
                    if word.lower() in result.lower():
                        return word
                return "Neutral"
                
        except Exception as e:
            print(f"Sentiment Service Error: {e}")
            return "Neutral"

sentiment_service = SentimentService()
