import httpx
from app.core.config import settings

class SummarizerService:
    @staticmethod
    async def summarize(text: str) -> str:
        if len(text) < 50:
            return text

        if not settings.AI_API_KEY or not settings.AI_API_URL:
            print("Warning: AI API Key or URL missing. Returning text as is.")
            return text

        try:
            headers = {
                "Authorization": f"Bearer {settings.AI_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "minimax/minimax-m2.5:free", 
                "messages": [
                    {"role": "system", "content": "You are an expert content editor. Summarize the following blog post into a concise, engaging summary (max 3-4 sentences). Capture the main ideas and the hooking element. Return ONLY plain text. DO NOT use markdown formatting (like ** or #), DO NOT use HTML tags, and DO NOT use LaTeX symbols. Output as a single paragraph."},
                    {"role": "user", "content": text[:4000]}
                ]
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(settings.AI_API_URL, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data['choices'][0]['message']['content'].strip()
                
        except Exception as e:
            print(f"AI Service Error: {e}")
            return text[:200] + "..."

summarizer_service = SummarizerService()
