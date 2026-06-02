from fastapi import APIRouter, Query
from datetime import date
import hashlib
import json
from google.cloud import bigquery
import os

from src.utils.bigquery import run_query
from src.utils.postgres import get_org_currency
from src.utils import redis
from src.models.responses import (
    MetricsSummaryResponse, MetricTopService, MetricsSpendOverTimeResponse, 
    MetricDataPoint, MetricServiceSpendRowResponse, MetricServiceSpendResponse, 
    MetricTeamSpendRowResponse, MetricTeamSpendResponse
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


@router.get("/metrics/summary", response_model=MetricsSummaryResponse)
async def get_metrics_summary(
    org_id: str = Query(...),
    from_date: date = Query(...),
    to_date: date = Query(...)
):
    """
    Powers the four metric cards on the main dashboard.
    Called on page load. Returns total spend, MTD vs prior month,
    top service by cost, and tag coverage score for the given org and date range.
    """
    cache_key = _cache_key(org_id, "summary", from_date, to_date)
    cached = redis.get(cache_key)
    if cached:
        return MetricsSummaryResponse(**json.loads(cached))

    # Main spend query
    spend_sql = f"""
        SELECT
            ROUND(SUM(net_amortised_cost), 2) AS total_spend,
            ROUND(SUM(CASE WHEN charge_period_start >= DATE_TRUNC(CURRENT_DATE(), MONTH)
                THEN net_amortised_cost ELSE 0 END), 2) AS mtd_spend,
            ROUND(SUM(CASE WHEN charge_period_start >= DATE_SUB(DATE_TRUNC(CURRENT_DATE(), MONTH), INTERVAL 1 MONTH)
                AND charge_period_start < DATE_TRUNC(CURRENT_DATE(), MONTH)
                THEN net_amortised_cost ELSE 0 END), 2) AS prior_month_spend
        FROM {TABLE}
        WHERE org_id = @org_id
          AND charge_period_start BETWEEN @from_date AND @to_date
    """

    # Top service query
    top_sql = f"""
        SELECT service_name, ROUND(SUM(net_amortised_cost), 2) AS cost
        FROM {TABLE}
        WHERE org_id = @org_id
          AND charge_period_start BETWEEN @from_date AND @to_date
        GROUP BY service_name
        ORDER BY cost DESC
        LIMIT 1
    """

    params = [
        bigquery.ScalarQueryParameter("org_id",    "STRING", org_id),
        bigquery.ScalarQueryParameter("from_date", "DATE",   str(from_date)),
        bigquery.ScalarQueryParameter("to_date",   "DATE",   str(to_date)),
    ]

    spend_rows = run_query(spend_sql, params)
    top_rows   = run_query(top_sql,   params)
    currency   = get_org_currency(org_id)

    spend = spend_rows[0] if spend_rows else {}
    top   = top_rows[0]   if top_rows   else {"service_name": "N/A", "cost": 0.0}

    total        = spend.get("total_spend", 0.0)       or 0.0
    mtd          = spend.get("mtd_spend", 0.0)         or 0.0
    prior        = spend.get("prior_month_spend", 0.0) or 0.0
    mtd_change   = round((mtd - prior) / prior * 100, 1) if prior else 0.0

    result = MetricsSummaryResponse(
        total_spend        = total,
        mtd_spend          = mtd,
        prior_month_spend  = prior,
        mtd_change_percent = mtd_change,
        top_service        = MetricTopService(name=top["service_name"], cost=top["cost"]),
        tag_coverage_score = 0,   # TODO: pull from Postgres when Sarah's back
        currency           = currency
    )

    redis.set(cache_key, json.dumps(result.dict()), ttl=TTL)
    return result
    

@router.get("/metrics/spend-over-time", response_model=MetricsSpendOverTimeResponse)
async def get_spend_over_time(
    org_id: str = Query(...),
    from_date: date = Query(...),
    to_date: date = Query(...)
):
    """
    Powers the main spend chart. Returns daily spend figures for the selected date range.

    Returns
        Daily net_amortised_cost and currency
    """
    cache_key = _cache_key(org_id, "spend-over-time", from_date, to_date)
    cached = redis.get(cache_key)
    if cached:
        return MetricsSpendOverTimeResponse(**json.loads(cached))

    sql = f"""
        SELECT
            charge_period_start AS date,
            ROUND(SUM(net_amortised_cost), 2) AS net_amortised_cost
        FROM {TABLE}
        WHERE org_id = @org_id
          AND charge_period_start BETWEEN @from_date AND @to_date
        GROUP BY date
        ORDER BY date ASC
    """

    params = [
        bigquery.ScalarQueryParameter("org_id",    "STRING", org_id),
        bigquery.ScalarQueryParameter("from_date", "DATE",   str(from_date)),
        bigquery.ScalarQueryParameter("to_date",   "DATE",   str(to_date)),
    ]

    rows     = run_query(sql, params)
    currency = get_org_currency(org_id)

    result = MetricsSpendOverTimeResponse(
        data_points=[
            MetricDataPoint(date=str(r["date"]), net_amortised_cost=r["net_amortised_cost"])
            for r in rows
        ],
        currency=currency
    )

    redis.set(cache_key, json.dumps(result.dict()), ttl=TTL)
    return result


@router.get("/metrics/by-service", response_model=MetricServiceSpendResponse)
async def get_spend_by_service(org_id: str = Query(...), from_date: date = Query(...), to_date: date = Query(...)):
    """
    Powers the `spend by service` chart on the dashboard.

    Return
        ranked list of cost by service within selected date range.
    """

    cache_key = _cache_key(org_id, "spend-by-service", from_date, to_date)
    cached = redis.get(cache_key)
    if cached:
        return MetricServiceSpendResponse(**json.loads(cached))
    
    sql = f"""
        SELECT 
            service_name, 
            ROUND(SUM(net_amortised_cost), 2) as total_spend,
            ROUND(100 * SUM(net_amortised_cost) / SUM(SUM(net_amortised_cost)) OVER (), 1) AS percent_of_total
        FROM {TABLE}
        WHERE org_id = @org_id
            AND charge_period_start BETWEEN @from_date AND @to_date
        GROUP BY service_name
        ORDER BY total_spend DESC
        """
    
    params = [
        bigquery.ScalarQueryParameter("org_id",    "STRING", org_id),
        bigquery.ScalarQueryParameter("from_date", "DATE",   str(from_date)),
        bigquery.ScalarQueryParameter("to_date",   "DATE",   str(to_date)),
    ]

    rows     = run_query(sql, params)
    currency = get_org_currency(org_id)
    
    result =  MetricServiceSpendResponse(
        rows = [
            MetricServiceSpendRowResponse(
                service_name=r["service_name"], 
                net_amortised_cost=r["total_spend"], 
                percent_of_total=r["percent_of_total"]
                )
            for r in rows
            ],
        currency = currency
    )
    redis.set(cache_key, json.dumps(result.dict()), ttl=TTL)
    return result


@router.get("/metrics/by-team", response_model=MetricTeamSpendResponse)
async def get_spend_by_team(org_id: str = Query(...), from_date: date = Query(...), to_date: date = Query(...)):
    """
    Powers the `spend by team` chart on the dashboard.

    Return
        ranked list of cost by team tag value within selected date range.
    """

    cache_key = _cache_key(org_id, "spend-by-team", from_date, to_date)
    cached = redis.get(cache_key)
    if cached:
        return MetricTeamSpendResponse(**json.loads(cached))
    
    sql = f"""
        SELECT 
            COALESCE(JSON_EXTRACT_SCALAR(normalised_tags, '$.team'), 'untagged') AS team, 
            ROUND(SUM(net_amortised_cost), 2) as total_spend,
            ROUND(100 * SUM(net_amortised_cost) / SUM(SUM(net_amortised_cost)) OVER (), 1) AS percent_of_total
        FROM {TABLE}
        WHERE org_id = @org_id
            AND charge_period_start BETWEEN @from_date AND @to_date
        GROUP BY team
        ORDER BY total_spend DESC
        """

    params = [
        bigquery.ScalarQueryParameter("org_id",    "STRING", org_id),
        bigquery.ScalarQueryParameter("from_date", "DATE",   str(from_date)),
        bigquery.ScalarQueryParameter("to_date",   "DATE",   str(to_date)),
    ]

    rows     = run_query(sql, params)
    currency = get_org_currency(org_id)

    if not any(r["team"] == "untagged" for r in rows):
        rows.append({"team": "untagged", "total_spend": 0.0, "percent_of_total": 0.0})

    result =  MetricTeamSpendResponse(
        rows = [
            MetricTeamSpendRowResponse(
                team=r["team"], 
                net_amortised_cost=r["total_spend"], 
                percent_of_total=r["percent_of_total"]) 
                for r in rows 
            ],
        currency = currency
    )

    redis.set(cache_key, json.dumps(result.dict()), ttl=TTL)
    return result
