from typing import Optional
from pydantic import BaseModel

from src.models.focus import DataFormat


class ConnectorConfig(BaseModel):
    # Auth — unchanged per provider
    connector_type: str     # "aws" | "gcp" | "azure" | "datadog"
    org_id: str
    display_name: str
    data_format: DataFormat.FOCUS_1_3        # format the data arrives in "focus_1_3" | "aws_cur" | "gcp_billing" | "azure_cost"
    primary_cost_metric: str     # "net_amortised" | "amortised" | "billed"

class AWSConnectorConfig(ConnectorConfig):
    role_arn: str
    bucket_name: str
    s3_prefix: str
    report_name: str
    # data_format will be "aws_cur" until AWS natively publishes FOCUS exports, the nchange to "focus_1_3"

class GCPConnectorConfig(ConnectorConfig):
    sa_json_b64: str
    dataset_id: str
    project_id: str
    # GCP billing export is moving towards FOCUS — data_format handles the transition

class AzureConnectorConfig(ConnectorConfig):
    tenant_id: str         
    client_id: str
    client_secret: str
    subscription_id: str
