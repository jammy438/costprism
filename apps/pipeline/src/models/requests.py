from typing import Optional
from pydantic import BaseModel


class PipelineTriggerRequest(BaseModel):
    org_id: str
    connector_id: str


class ConnectorTestRequest(BaseModel):
    org_id: str
    connector_type: str
    config: dict


class PricingEstimateResource(BaseModel):
    provider: str
    region: str
    resource_type: str
    sku: str
    count: int


class PricingEstimateRequest(BaseModel):
    org_id: str
    resources: list[PricingEstimateResource]