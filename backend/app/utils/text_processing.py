import hashlib
import math

def hash_edit_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()

def verify_edit_key(key: str, hashed_key: str) -> bool:
    return hash_edit_key(key) == hashed_key

def calculate_reading_time(content: str) -> str:
    words = len(content.split())
    minutes = math.ceil(words / 200)
    return f"{minutes} min read"
