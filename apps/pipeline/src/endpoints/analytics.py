from fastapi import APIRouter, Query
from datetime import date, datetime
import hashlib
import json
from google.cloud import bigquery
import os

from src.utils.bigquery import run_query
from src.utils.postgres import get_org_currency
from src.utils import redis

from src.models.responses import (
    AnomaliesResponse, AnomalyResponse,
    SavingsOpportunitiesResponse, SavingsOpportunityResponse,
    PipelineHealthResponse, ConnectorHealthResponse,
    MetricProviderSpendResponse, MetricProviderSpendRowResponse,
)


router = APIRouter()

PROJECT = os.getenv("BIGQUERY_PROJECT_ID")
DATASET = os.getenv("BIGQUERY_DATASET")
TABLE   = f"`{PROJECT}.{DATASET}.fct_focus_costs`"
TTL     = 300  # 5 min cache


def _cache_key(org_id: str, endpoint: str, from_date, to_date) -> str:
    hash_input = f"{endpoint}:{from_date}:{to_date}"
    h = hashlib.md5(hash_input.encode()).hexdigest()
    return f"cache:metrics:{org_id}:{h}"


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
    """
    cache_key = _cache_key(org_id, "anomalies", from_date, to_date)
    cached = redis.get(cache_key)
    if cached:
        return AnomaliesResponse(**json.loads(cached))
# -- Detect day-on-day spikes: > 20% increase AND > £200 absolute (dual threshold)
    sql = f"""
    WITH daily AS (
    SELECT 
        service_name, 
        charge_period_start AS day,
        SUM(net_amortised_cost) AS daily_cost
    FROM `{TABLE}`
    WHERE org_id = @org_id
        AND charge_period_start BETWEEN @from_date AND @to_date
    GROUP BY service_name, day
    ),
    with_prev AS (
    SELECT 
        *, 
        LAG(daily_cost) OVER (PARTITION BY service_name ORDER BY day) AS prev_day_cost
    FROM daily
    )
    SELECT 
        service_name, 
        day, 
        daily_cost, 
        prev_day_cost,
        ROUND((daily_cost - prev_day_cost) / prev_day_cost * 100, 1) AS pct_change
    FROM with_prev
    WHERE prev_day_cost IS NOT NULL
        AND daily_cost > prev_day_cost * 1.20   -- 20% threshold
        AND (daily_cost - prev_day_cost) > 200  -- £200 absolute threshold
    ORDER BY pct_change DESC
    LIMIT @limit
    """

    params = [
        bigquery.ScalarQueryParameter("org_id",    "STRING", org_id),
        bigquery.ScalarQueryParameter("from_date", "DATE",   str(from_date)),
        bigquery.ScalarQueryParameter("to_date",   "DATE",   str(to_date)),
        bigquery.ScalarQueryParameter("limit",   "INT64",   limit)
    ]

    rows     = run_query(sql, params)
    currency = get_org_currency(org_id)

    result =  AnomaliesResponse(
        anomalies=[
            AnomalyResponse(
                id=f"anm_{r['service_name']}_{r['day']}",
                title=f"Unexpected spike in {r['service_name']}",
                description=f"{r['service_name']} spend increased {r['pct_change']}% day-on-day.",
                severity="critical" if r["pct_change"] > 50 else "warning",
                service_name=r["service_name"],
                spend_impact=r["daily_cost"],
                detected_at=datetime.combine(r["day"], datetime.min.time()),
                currency=currency,
            )
            for r in rows
        ],
        currency=currency,
    )

    redis.set(cache_key, json.dumps(result.dict()), ttl=TTL)

    return result


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


# STUBBED — requires DATABASE_URL (Supabase)
# Wire when Sarah's back. SQL ready above.
# Also needs: asyncpg client in utils/postgres.py
# Function will need refactoring
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
    cache_key = _cache_key(org_id, "health")
    cached = redis.get(cache_key)
    if cached:
        return PipelineHealthResponse(**json.loads(cached))

    # sql = """
    #     SELECT c.id, c.name, c.status, c.last_synced_at,
    #         c.last_sync_row_count, c.last_error,
    #         ROUND(100.0 * COUNT(CASE WHEN j.status = 'success' THEN 1 END) / COUNT(*), 1) AS success_rate_7d
    #     FROM connectors c
    #     LEFT JOIN ingestion_jobs j ON j.connector_id = c.id
    #         AND j.created_at > NOW() - INTERVAL '7 days'
    #     WHERE c.org_id = @org_id
    #     GROUP BY c.id, c.name, c.status, c.last_synced_at, c.last_sync_row_count, c.last_error
    #     """
    
    params = [
        bigquery.ScalarQueryParameter("org_id",    "STRING", org_id)
    ]

    rows     = run_query(sql, params)

    result = PipelineHealthResponse(
        connectors=[
            ConnectorHealthResponse(
                connector_id=r["id"],
                connector_name=r["name"],
                status=r["status"],
                last_sync_at=r["last_sync_at"],
                last_sync_row_count=r["last_sync_row_count"],
                last_error=r["last_error"],
                success_rate_7d=r["success_rate_7d"],
            )
            for r in rows
        ],
        overall_success_rate=98.5,
        total_jobs_7d=14,
    )

    redis.set(cache_key, json.dumps(result.dict()), ttl=TTL)
    return result


@router.get("/metrics/by-provider", response_model=MetricProviderSpendResponse)
async def get_spend_by_provider(
    org_id: str = Query(...),
    from_date: date = Query(...),
    to_date: date = Query(...),
):
    """
    Powers the cost allocation by provider chart on the dashboard.

    """

    cache_key = _cache_key(org_id, "by-provider", from_date, to_date)
    cached = redis.get(cache_key)
    if cached:
        return MetricProviderSpendResponse(**json.loads(cached))
    
    sql = f"""
        SELECT 
            COALESCE(provider, 'unknown') AS provider,
            ROUND(SUM(net_amortised_cost), 2) as net_amortised_cost,
            ROUND(100 * SUM(net_amortised_cost) / SUM(SUM(net_amortised_cost)) OVER (), 1) AS percent_of_total
        FROM {TABLE}
        WHERE org_id = @org_id
            AND charge_period_start BETWEEN @from_date AND @to_date
        GROUP BY provider
        ORDER BY net_amortised_cost DESC
        """

    params = [
        bigquery.ScalarQueryParameter("org_id",    "STRING", org_id),
        bigquery.ScalarQueryParameter("from_date", "DATE",   str(from_date)),
        bigquery.ScalarQueryParameter("to_date",   "DATE",   str(to_date)),
    ]

    rows     = run_query(sql, params)
    currency = get_org_currency(org_id)

    if not any(r["provider"] == "unknown" for r in rows):
        rows.append({"provider": "unknown", "net_amortised_cost": 0.0, "percent_of_total": 0.0})


    result =  MetricProviderSpendResponse(
        rows=[
            MetricProviderSpendRowResponse(
                provider=r["provider"],
                net_amortised_cost=r["net_amortised_cost"],
                percent_of_total=r["percent_of_total"],
            ) 
            for r in rows
        ],
        currency=currency,
    )
    redis.set(cache_key, json.dumps(result.dict()), ttl=TTL)

    return result
