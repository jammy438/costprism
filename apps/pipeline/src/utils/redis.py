import redis
import os
from dotenv import load_dotenv

# SET UP REDIS DATABASE THEN CHANGE .ENV

load_dotenv()


def _get_client():
    """
    Loads the REDIS_URL from environment in order to create a client object.

    Returns: 
        Redis client instance connected to the URL
    """
    url = os.getenv("REDIS_URL")
    if not url:
        raise ValueError("REDIS_URL environment variable is not set")
 
    return redis.from_url(url)


_client = _get_client()


def get(key: str):
    """
    Retieves data from redis database.
    
    Args:
        key: key to connect to the redis db
        
    Returns:
        value: value stored at the key
    """

    return _client.get(key)


def set(key: str, value: str, ttl: int = None):
    """
    Load data in to the redis database.
    
    Args:
        key: key to connect to the redis db
        value: data to be loaded into the db
        ttl: How long the data should remain in the db
        
    Returns:
        True if successful
    """
    return _client.set(key, value, ex=ttl)


def publish(channel: str, message: str):
    """
    Broadcast a message to subscribers of the channel.
    
    Args:
        channel: location for data to be loaded
        message: data to be loaded
        
    Returns:
        data: number of subscribers that recieved the message
    """
    
    return _client.publish(channel, message)
