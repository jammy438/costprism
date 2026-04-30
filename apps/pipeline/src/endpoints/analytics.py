from fastapi import APIRouter, Query
from datetime import date, datetime
from src.models.responses import (
    AnomaliesResponse, AnomalyResponse,
    SavingsOpportunitiesResponse, SavingsOpportunityResponse,
    PipelineHealthResponse, ConnectorHealthResponse,
    MetricProviderSpendResponse, MetricProviderSpendRowResponse,
)

router = APIRouter()


@router.get("/anomalies", response_model=AnomaliesResponse)
async def get_anomalies(
    org_id: str = Query(...),
    from_date: date = Query(...),
    to_date: date = Query(...),
    limit: int = Query(10),
):
    """
    Powers the anomaly detection cards on the dashboard.
    Returns unexpected cost spikes detected against historical patterns.

    TODO:
    - replace mock with run_query() against BigQuery
    - detect day-on-day spend increases > 20% AND > £200 absolute (dual threshold)
    - group by service_name, filter by org_id
    - pull display_currency from organisations table in Postgres
    """
    return AnomaliesResponse(
        anomalies=[
            AnomalyResponse(
                id="anm_001",
                title="Unexpected increase in EC2 costs",
                description="EC2 spend increased 34% day-on-day, exceeding the 20% anomaly threshold.",
                severity="warning",
                service_name="Amazon EC2",
                spend_impact=1240.00,
                detected_at=datetime(2026, 3, 15, 9, 0, 0),
                currency="GBP",
            ),
            AnomalyResponse(
                id="anm_002",
                title="RDS instances running at low utilisation",
                description="Several RDS instances have been running at less than 10% CPU for 7 days.",
                severity="critical",
                service_name="Amazon RDS",
                spend_impact=890.00,
                detected_at=datetime(2026, 3, 14, 8, 0, 0),
                currency="GBP",
            ),
            AnomalyResponse(
                id="anm_003",
                title="New resource detected",
                description="A new ElastiCache cluster was provisioned in eu-west-1.",
                severity="info",
                service_name="Amazon ElastiCache",
                spend_impact=120.00,
                detected_at=datetime(2026, 3, 13, 12, 0, 0),
                currency="GBP",
            ),
        ],
        currency="GBP",
    )


@router.get("/metrics/savings-opportunities", response_model=SavingsOpportunitiesResponse)
async def get_savings_opportunities(
    org_id: str = Query(...),
    from_date: date = Query(...),
    to_date: date = Query(...),
):
    """
    Powers the savings opportunities card on the dashboard.
    Returns actionable cost reduction recommendations.

    TODO:
    - replace mock with run_query() against BigQuery
    - identify underutilised instances (CPU < 10% for 7 days)
    - identify unused resources (no traffic for 7 days)
    - identify RI/SP coverage gaps
    - pull display_currency from organisations table in Postgres
    """
    return SavingsOpportunitiesResponse(
        opportunities=[
            SavingsOpportunityResponse(
                id="sav_001",
                title="Right-size underutilised EC2 instances",
                description="3 EC2 instances running at <10% CPU for 7+ days. Downsize to save.",
                estimated_monthly_saving=420.00,
                category="rightsizing",
                currency="GBP",
            ),
            SavingsOpportunityResponse(
                id="sav_002",
                title="Purchase Reserved Instances for stable workloads",
                description="Your EC2 usage pattern qualifies for 1-year reserved pricing.",
                estimated_monthly_saving=1800.00,
                category="reserved",
                currency="GBP",
            ),
            SavingsOpportunityResponse(
                id="sav_003",
                title="Delete unused EBS volumes",
                description="4 unattached EBS volumes detected. No reads/writes for 30+ days.",
                estimated_monthly_saving=85.00,
                category="unused",
                currency="GBP",
            ),
        ],
        total_estimated_saving=2305.00,
        currency="GBP",
    )


@router.get("/connectors/health", response_model=PipelineHealthResponse)
async def get_connectors_health(org_id: str = Query(...)):
    """
    Powers the pipeline health card on the dashboard.
    Returns sync status and success rate for each connector.

    TODO:
    - replace mock with query against Postgres connectors table
    - calculate success_rate_7d from ingestion_jobs table
    - pull last_sync_at, last_sync_row_count, last_error_message from connectors table
    """
    return PipelineHealthResponse(
        connectors=[
            ConnectorHealthResponse(
                connector_id="conn_001",
                connector_name="Production AWS",
                status="healthy",
                last_sync_at=datetime(2026, 3, 15, 6, 0, 0),
                last_sync_row_count=42310,
                last_error=None,
                success_rate_7d=98.5,
            ),
        ],
        overall_success_rate=98.5,
        total_jobs_7d=14,
    )


@router.get("/metrics/by-provider", response_model=MetricProviderSpendResponse)
async def get_spend_by_provider(
    org_id: str = Query(...),
    from_date: date = Query(...),
    to_date: date = Query(...),
):
    """
    Powers the cost allocation by provider chart on the dashboard.

    TODO:
    - replace mock with run_query() against BigQuery
    - aggregate SUM(net_amortised_cost) grouped by provider
    - pull display_currency from organisations table in Postgres
    """
    return MetricProviderSpendResponse(
        rows=[
            MetricProviderSpendRowResponse(
                provider="AWS",
                net_amortised_cost=48320.00,
                percent_of_total=100.0,
            ),
        ],
        currency="GBP",
    )