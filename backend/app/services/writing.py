import httpx
from app.core.config import settings

class WritingService:
    async def _call_ai(self, system_prompt: str, user_content: str) -> str:
        if not settings.AI_API_KEY or not settings.AI_API_URL:
            return "AI API Key missing. Please configure it in settings."

        try:
            headers = {
                "Authorization": f"Bearer {settings.AI_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "tngtech/tng-r1t-chimera:free",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content[:4000]}
                ]
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(settings.AI_API_URL, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data['choices'][0]['message']['content'].strip()
        except Exception as e:
            print(f"AI Writing Service Error: {e}")
            return f"Error generating content: {str(e)}"

    async def generate_outline(self, title: str) -> str:
        prompt = "You are an expert blog post outliner. Create a structured markdown outline for a blog post with this title. Include Introduction, Key Points (3-5), and Conclusion."
        return await self._call_ai(prompt, title)

    async def polish_content(self, content: str) -> str:
        prompt = "You are an expert pro editor. Rewrite the following text to be more engaging, professional, and grammatically correct, while preserving the original meaning. Return ONLY the rewritten text."
        return await self._call_ai(prompt, content)

    async def generate_suggestions(self, content: str) -> str:
        prompt = "You are a writing coach. Analyze the following blog draft and provide 3-5 actionable suggestions to improve it. Focus on clarity, engagement, and structure. Format as a markdown list."
        return await self._call_ai(prompt, content)

writing_service = WritingService()
