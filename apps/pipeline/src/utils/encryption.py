import os
import json
from cryptography.fernet import Fernet
from dotenv import load_dotenv


load_dotenv()


def _get_fernet():
    """
    Loads the CONNECTOR_ENCRYPTION_KEY from environment 

    Returns: 
        f: configured Fernet instance ready for encryption/decryption.
    """
    str_key = os.getenv("CONNECTOR_ENCRYPTION_KEY")
    if not str_key:
        raise ValueError("CONNECTOR_ENCRYPTION_KEY environment variable is not set")
    key = str_key.encode()
    f=Fernet(key)
    return f


def encrypt_config(msg: bytes) -> bytes:
    """
    Encrypt a connector config blob.
    
    Args:
        msg: message / config to be encrypted
        
    Returns:
        token: Fernet encrypted token
    """
    if isinstance(msg, str):
        msg = msg.encode()
    
    f = _get_fernet()
    token = f.encrypt(msg)

    return token


def decrypt_config(token: bytes) -> dict:
    """
    Decrypt an encrypted connector config blob.
    
    Args:
        token: Fernet-encrypted bytes from Sarah's API
        
    Returns:
        Decrypted config as a dictionary (e.g. AWSConnectorConfig fields)
    """
    f = _get_fernet()
    decrypted_data = f.decrypt(token)

    return json.loads(decrypted_data)
