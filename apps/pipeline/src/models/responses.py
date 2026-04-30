from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime

from src.models.focus import FocusCostRow

class ConnectorTest(BaseModel):
    success: bool
    error: Optional[str] = None


class CostResponse(BaseModel):
    rows: list[FocusCostRow]
    total: int
    page: int
    page_size: int


class PipelineTriggerResponse(BaseModel):
    job_id: str
    status: str


class MetricTopService(BaseModel):
    name: str
    cost: float


class MetricsSummaryResponse(BaseModel):
    total_spend: float
    mtd_spend: float
    prior_month_spend: float
    mtd_change_percent: float
    top_service: MetricTopService
    tag_coverage_score: int
    currency: str


class MetricDataPoint(BaseModel):
    date: date
    net_amortised_cost: float

class MetricsSpendOverTimeResponse(BaseModel):
    data_points: list[MetricDataPoint]
    currency: str


class MetricServiceSpendRowResponse(BaseModel):
    service_name: str
    net_amortised_cost: float
    percent_of_total: float

    
class MetricServiceSpendResponse(BaseModel):
    rows: list[MetricServiceSpendRowResponse]
    currency: str


class MetricTeamSpendRowResponse(BaseModel):
    team: str
    net_amortised_cost: float
    percent_of_total: float

    
class MetricTeamSpendResponse(BaseModel):
    rows: list[MetricTeamSpendRowResponse]
    currency: str


class TagsDiscoveredResponse(BaseModel):
    key: str
    resources_tagged: int
    spend_covered: float
    variants_found: list[str]
    top_values: list[str]


class TagsDiscoveredKeysResponse(BaseModel):
    discovered_keys: list[TagsDiscoveredResponse]
    untagged_spend: float
    total_spend: float
    currency: str


class TagsNormalisedResponse(BaseModel):
    canonical_key: str
    canonical_values: dict[str, list[str]]
    resources_normalised: int
    spend_covered: float


class TagsNormalisedKeysResponse(BaseModel):
    normalised_keys: list[TagsNormalisedResponse]
    currency: str   


class PricingLookupResponse(BaseModel):
    provider: str
    region: str
    sku: str
    price_per_unit: float
    unit: str
    currency: str
    cached_at: datetime
    freshness_warning: bool


class PricingEstimateResponse(BaseModel):
    monthly_cost: float
    daily_cost: float 
    currency: str 
    cached_at: datetime 
    freshness_warning: bool

class AnomalyResponse(BaseModel):
    id: str
    title: str
    description: str
    severity: str  # 'warning' | 'critical' | 'info'
    service_name: str
    spend_impact: float
    detected_at: datetime
    currency: str
 
class AnomaliesResponse(BaseModel):
    anomalies: list[AnomalyResponse]
    currency: str
 
class SavingsOpportunityResponse(BaseModel):
    id: str
    title: str
    description: str
    estimated_monthly_saving: float
    category: str  # 'rightsizing' | 'reserved' | 'unused' | 'scheduling'
    currency: str
 
class SavingsOpportunitiesResponse(BaseModel):
    opportunities: list[SavingsOpportunityResponse]
    total_estimated_saving: float
    currency: str
 
class ConnectorHealthResponse(BaseModel):
    connector_id: str
    connector_name: str
    status: str  # 'healthy' | 'degraded' | 'error'
    last_sync_at: Optional[datetime]
    last_sync_row_count: Optional[int]
    last_error: Optional[str]
    success_rate_7d: float  # percentage
 
class PipelineHealthResponse(BaseModel):
    connectors: list[ConnectorHealthResponse]
    overall_success_rate: float
    total_jobs_7d: int
 
class MetricProviderSpendRowResponse(BaseModel):
    provider: str
    net_amortised_cost: float
    percent_of_total: float
 
class MetricProviderSpendResponse(BaseModel):
    rows: list[MetricProviderSpendRowResponse]
    currency: str