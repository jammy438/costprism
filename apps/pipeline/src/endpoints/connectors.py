from fastapi import APIRouter
from src.models.responses import ConnectorTest
from src.models.requests import ConnectorTestRequest


router = APIRouter()


@router.post("/connectors/test", response_model=ConnectorTest)
async def post_connector(request: ConnectorTestRequest):
    """
    Called when the customer clicks 'Test connection' in the connector wizard. 
    It validates that the credentials work before the connector is saved.

    Recieves and decrypts connector config from postgres
    Calls assume_customer_role() with customers IAM role ARN
    Lists Bucket

    Returns
    {"success": True} is successfull, {"success": False, "error": "..."} if fails

    TODO
    - decrypt request.config using utils/encryption.py
    - call assume_customer_role() from connectors/aws_cur.py
    - verify S3 bucket access
    - return real success/failure instead of mock
    """
    
    return {"success": True}
