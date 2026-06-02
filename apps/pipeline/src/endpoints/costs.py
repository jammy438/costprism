from fastapi import APIRouter, Query
from datetime import date
import hashlib
import json
from google.cloud import bigquery
import os

from src.utils.bigquery import run_query
from src.utils.postgres import get_org_currency
from src.utils import redis

from src.models.responses import CostResponse


# MOCK_COST_ROWS = [
#         {
#             "org_id":              "01102BR",
#             "connector_id":        "11",
#             "ingested_at":         "2026-02-01",
#             "data_format":         "focus_1_3",
#             "charge_period_start": "2026-01-01",
#             "charge_period_end":   "2026-01-31",
#             "charge_type":         "Usage",
#             "provider":            "AWS",
#             "service_name":        "Redshift",
#             "region_name":         "eu-west-1",
#             "net_amortised_cost":  8322.37,
#             "amortised_cost":      11037.50,
#             "billed_cost":         12300.44,
#             "original_currency":   "USD",
#             "original_amount":     8322.37, 
#             "display_currency":    "GBP",
#             "display_amount":      10319.73, 
#             "exchange_rate":       1.24, 
#             "exchange_rate_date":  "2026-02-20",
#             "resource_id":         None,
#             "resource_name":       None,
#             "tags":                {"Env": "prd", "ENV": "PROD"},
#             "normalised_tags":     {"environment": "production"}
#         }
#     ]


router = APIRouter()

PROJECT = os.getenv("BIGQUERY_PROJECT_ID")
DATASET = os.getenv("BIGQUERY_DATASET")
TABLE   = f"`{PROJECT}.{DATASET}.fct_focus_costs`"
TTL     = 300  # 5 min cache


def _cache_key(org_id: str, endpoint: str, from_date, to_date) -> str:
    hash_input = f"{endpoint}:{from_date}:{to_date}"
    h = hashlib.md5(hash_input.encode()).hexdigest()
    return f"cache:metrics:{org_id}:{h}"


@router.get("/costs", response_model=CostResponse)
async def get_costs(
    org_id: str = Query(...),
    from_date: date = Query(...),
    to_date: date = Query(...),
    source: str | None = Query(None),
    page: int = 1,
    page_size: int = 100
):
    """
    Returns the data for required organisation between specific start and end dates.
    cusomises the number of records per page and the starting page.
    Optional filtering for connector type.

    Validates the return values matches CostResponse structure.
    Populates the cost table on the dashboard
    """

    cache_key = _cache_key(org_id, "costs", from_date, to_date)
    cached = redis.get(cache_key)
    if cached:
        return CostResponse(**json.loads(cached))

    source_filter = "AND connector_id = @source" if source else ""

    sql = f"""
        SELECT
            org_id,
            connector_id,
            ingested_at,
            data_format,
            charge_period_start,
            charge_period_end,
            charge_type,
            provider,
            service_name,
            region_name,
            ROUND(net_amortised_cost, 2) AS net_amortised_cost,
            ROUND(amortised_cost, 2) AS amortised_cost,
            ROUND(billed_cost, 2) AS billed_cost,
            original_currency,
            ROUND(original_amount, 2) AS original_amount,
            display_currency,
            ROUND(display_amount, 2) AS display_amount,
            exchange_rate,
            exchange_rate_date,
            resource_id,
            resource_name,
            tags,
            normalised_tags
        FROM {TABLE}
        WHERE org_id = @org_id
          AND charge_period_start BETWEEN @from_date AND @to_date
          {source_filter}
        ORDER BY charge_period_start DESC
        LIMIT @page_size OFFSET @offset
        """
    
    total_count_sql = f"""
            SELECT COUNT(*) AS total FROM {TABLE}
            WHERE org_id = @org_id
            AND charge_period_start BETWEEN @from_date AND @to_date
            {source_filter}
            """
    params = [
        bigquery.ScalarQueryParameter("org_id",    "STRING", org_id),
        bigquery.ScalarQueryParameter("from_date", "DATE",   str(from_date)),
        bigquery.ScalarQueryParameter("to_date",   "DATE",   str(to_date)),
        bigquery.ScalarQueryParameter("page_size", "INT64", page_size),
        bigquery.ScalarQueryParameter("offset",    "INT64", (page - 1) * page_size)
    ]

    if source:
        params.append(bigquery.ScalarQueryParameter("source", "STRING", source))

    rows = run_query(sql, params)
    total_count_rows = run_query(total_count_sql, params)

    result =  CostResponse(
        rows = rows, 
        total=total_count_rows[0]["total"], 
        page=page, 
        page_size=page_size
        )


    redis.set(cache_key, json.dumps(result.dict()), ttl=TTL)
    return result
