import redis
from app.core.config import settings

try:
    redis_client = redis.from_url(settings.redis_url, decode_responses=True)
    # Test connection
    redis_client.ping()
except (redis.ConnectionError, redis.TimeoutError):
    # Fallback to a mock Redis client for testing
    class MockRedis:
        def __init__(self):
            self.store = {}
        
        def get(self, key):
            return self.store.get(key)
        
        def set(self, key, value):
            self.store[key] = value
        
        def setex(self, key, time, value):
            self.store[key] = value
        
        def delete(self, key):
            self.store.pop(key, None)
    
    redis_client = MockRedis()

def get_redis():
    return redis_client
