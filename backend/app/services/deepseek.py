import httpx
import json
from typing import Dict, Any
from app.core.config import settings
from app.core.redis import get_redis
import hashlib

class DeepSeekService:
    def __init__(self):
        self.api_key = settings.deepseek_api_key
        self.api_url = settings.deepseek_api_url
        self.redis_client = get_redis()
    
    def _get_cache_key(self, citation_text: str) -> str:
        """Generate cache key from citation text"""
        return f"citation_validation:{hashlib.md5(citation_text.encode()).hexdigest()}"
    
    async def validate_citation(self, citation_text: str, source: str = None) -> Dict[str, Any]:
        """Validate citation using DeepSeek API with Redis caching"""
        cache_key = self._get_cache_key(citation_text)
        
        # Check cache first
        cached_result = self.redis_client.get(cache_key)
        if cached_result:
            return json.loads(cached_result)
        
        # If no API key configured, return mock validation
        if not self.api_key or self.api_key == "your_deepseek_api_key_here":
            result = self._mock_validation(citation_text, source)
        else:
            result = await self._call_deepseek_api(citation_text, source)
        
        # Cache the result for 1 hour
        self.redis_client.setex(cache_key, 3600, json.dumps(result))
        
        return result
    
    def _mock_validation(self, citation_text: str, source: str = None) -> Dict[str, Any]:
        """Mock validation for development/demo purposes"""
        # Simple heuristic: longer citations with sources get higher scores
        confidence = 0.5
        if source:
            confidence += 0.2
        if len(citation_text) > 100:
            confidence += 0.15
        if any(keyword in citation_text.lower() for keyword in ["study", "research", "published", "journal"]):
            confidence += 0.15
        
        confidence = min(confidence, 1.0)
        
        return {
            "status": "validated" if confidence > 0.6 else "needs_review",
            "confidence": confidence,
            "analysis": f"Citation appears {'credible' if confidence > 0.6 else 'to need further verification'}",
            "suggestions": ["Verify original source", "Check publication date"] if confidence < 0.7 else [],
            "mock": True
        }
    
    async def _call_deepseek_api(self, citation_text: str, source: str = None) -> Dict[str, Any]:
        """Call actual DeepSeek API for citation validation"""
        prompt = f"""Analyze this citation for credibility and accuracy:

Citation: {citation_text}
{f'Source: {source}' if source else ''}

Please evaluate:
1. Does this appear to be a legitimate citation?
2. Are there any red flags or issues?
3. What is the confidence level (0-1)?
4. Any suggestions for verification?

Respond in JSON format with: status, confidence, analysis, suggestions"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                
                # Try to parse JSON from response
                try:
                    result = json.loads(content)
                    return result
                except json.JSONDecodeError:
                    # If not JSON, create structured response
                    return {
                        "status": "validated",
                        "confidence": 0.7,
                        "analysis": content,
                        "suggestions": []
                    }
        except Exception as e:
            return {
                "status": "error",
                "confidence": 0.0,
                "analysis": f"Error validating citation: {str(e)}",
                "suggestions": ["Manual verification required"]
            }

deepseek_service = DeepSeekService()
