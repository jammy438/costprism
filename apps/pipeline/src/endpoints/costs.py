from datetime import date
from fastapi import APIRouter, Query

from src.models.responses import CostResponse


MOCK_COST_ROWS = [
        {
            "org_id":              "01102BR",
            "connector_id":        "11",
            "ingested_at":         "2026-02-01",
            "data_format":         "focus_1_3",
            "charge_period_start": "2026-01-01",
            "charge_period_end":   "2026-01-31",
            "charge_type":         "Usage",
            "provider":            "AWS",
            "service_name":        "Redshift",
            "region_name":         "eu-west-1",
            "net_amortised_cost":  8322.37,
            "amortised_cost":      11037.50,
            "billed_cost":         12300.44,
            "original_currency":   "USD",
            "original_amount":     8322.37, 
            "display_currency":    "GBP",
            "display_amount":      10319.73, 
            "exchange_rate":       1.24, 
            "exchange_rate_date":  "2026-02-20",
            "resource_id":         None,
            "resource_name":       None,
            "tags":                {"Env": "prd", "ENV": "PROD"},
            "normalised_tags":     {"environment": "production"}
        }
    ]


router = APIRouter()


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

    TO DO
    - replace MOCK_COST_ROWS with real BigQuery query via utils/bigquery.py
    - apply from_date and to_date filters to the query
    - apply source filter if provided
    - results will be cached in Redis with 5 minute TTL
    """
    rows = [row for row in MOCK_COST_ROWS if row["org_id"] == org_id]

    return CostResponse(
        rows = rows, 
        total=len(rows), 
        page=page, 
        page_size=page_size
        )
