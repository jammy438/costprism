import os
import json
from cryptography.fernet import Fernet
from dotenv import load_dotenv


load_dotenv()


def _get_fernet():
    str_key = os.getenv("CONNECTOR_ENCRYPTION_KEY")
    if not str_key:
        raise ValueError("CONNECTOR_ENCRYPTION_KEY environment variable is not set")
    key = str_key.encode()
    f=Fernet(key)
    return f


def encrypt_config(msg):
    if isinstance(msg, str):
        msg = msg.encode()
    
    f = _get_fernet()
    token = f.encrypt(msg)

    return token


def decrypt_config(token):
    f = _get_fernet()
    decrypted_data = f.decrypt(token)

    return json.loads(decrypted_data)
