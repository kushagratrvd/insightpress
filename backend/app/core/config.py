import os
from dotenv import load_dotenv
import json

load_dotenv(override=True)

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "InsightPress")
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "insightpress")
    ALLOWED_ORIGINS: list = json.loads(os.getenv("ALLOWED_ORIGINS", '["*"]'))
    
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_API_URL: str = os.getenv("AI_API_URL", "")

settings = Settings()
