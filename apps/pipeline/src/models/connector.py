# src/models/connector.py
from typing import Optional
from pydantic import BaseModel


class AWSConnectorConfig(BaseModel):
    role_arn: str           # e.g. arn:aws:iam::123456789:role/CostPrismReader
    bucket_name: str        # S3 bucket containing the CUR files
    region: str             # e.g. eu-west-1
    cur_prefix: Optional[str] = ""  # optional S3 key prefix


class GCPConnectorConfig(BaseModel):
    sa_json_b64: str        # base64-encoded service account JSON — Phase 2
    dataset_id: str         # BigQuery billing export dataset name


class AzureConnectorConfig(BaseModel):
    tenant_id: str          # Phase 2
    client_id: str
    client_secret: str
    subscription_id: str