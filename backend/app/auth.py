import os
import secrets

from fastapi import Header, HTTPException

API_KEY = os.getenv("WIKI_API_KEY", "dev-secret-key")

def require_api_key(x_api_key: str = Header(default="")):
    # secret.compare_digest 防止 timing attack, don't use ==
    if not secrets.compare_digest(x_api_key, API_KEY):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")