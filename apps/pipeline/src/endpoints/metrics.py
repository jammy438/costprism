from fastapi import APIRouter, Query
from datetime import date

from src.models.responses import MetricsSummaryResponse, MetricTopService, MetricsSpendOverTimeResponse, MetricDataPoint, MetricServiceSpendRowResponse, MetricServiceSpendResponse, MetricTeamSpendRowResponse, MetricTeamSpendResponse

router = APIRouter()


@router.get("/metrics/summary", response_model=MetricsSummaryResponse)
async def get_metrics_summary(org_id: str = Query(...), from_date: date = Query(...), to_date: date = Query(...)):
    """
    Powers the four metric cards on the main dashboard.
    Called on page load. Returns total spend, MTD vs prior month,
    top service by cost, and tag coverage score for the given org and date range.

    TODO:
    replace mock with run_query() against BigQuery
    aggregate SUM(net_amortised_cost) for date range, grouped by service
    pull tag_coverage_score from org config in Postgres
    pull display_currency from organisations table in Postgres
    """
    return MetricsSummaryResponse( 
        total_spend = 48320.00,
        mtd_spend = 12840.00,
        prior_month_spend = 44100.00,
        mtd_change_percent = 9.6,
        top_service = MetricTopService(
            name = "Amazon EC2",
            cost = 18240.00
        ),
        tag_coverage_score = 73,
        currency = "GBP"
        )
    

@router.get("/metrics/spend-over-time", response_model=MetricsSpendOverTimeResponse)
async def get_spend_over_time(org_id: str = Query(...), from_date: date = Query(...), to_date: date = Query(...)):
    """
    Powers the main spend chart. Returns daily spend figures for the selected date range.

    Returns
        Daily net_amortised_cost and currency
    
    TODO:
    replace with run_query() against BigQuery
    aggregate daily SUM(net_amortised_cost) grouped by charge_period_start
    pull display_currency from organisations table in Postgres

    Query:
    for each day in the date range:
        add up all net_amortised_cost rows for that day
        return the total
    """

    return MetricsSpendOverTimeResponse(
        data_points = [
            MetricDataPoint(date = "2025-03-01", net_amortised_cost = 1420.50),
            MetricDataPoint(date = "2025-03-02", net_amortised_cost = 1380.00)
        ],
        currency = "GBP"
    )


@router.get("/metrics/by-service", response_model=MetricServiceSpendResponse)
async def get_spend_by_service(org_id: str = Query(...), from_date: date = Query(...), to_date: date = Query(...)):
    """
    Powers the `spend by service` chart on the dashboard.

    Return
        ranked list of cost by service within selected date range.
    
    TODO:
    replace with run_query() against BigQuery
    aggregate SUM(net_amortised_cost) grouped by service_name
    pull display_currency from organisations table in Postgres
    """
    return MetricServiceSpendResponse(
        rows = [
            MetricServiceSpendRowResponse(service_name="Amazon EC2", net_amortised_cost=18240.00, percent_of_total=37.9),
            MetricServiceSpendRowResponse(service_name="Amazon RDS", net_amortised_cost=9120.00, percent_of_total=18.9),
            MetricServiceSpendRowResponse(service_name="Amazon S3", net_amortised_cost=4380.00, percent_of_total=9.1)
            ],
        currency = "GBP"
    )


@router.get("/metrics/by-team", response_model=MetricTeamSpendResponse)
async def get_spend_by_team(org_id: str = Query(...), from_date: date = Query(...), to_date: date = Query(...)):
    """
    Powers the `spend by team` chart on the dashboard.

    Return
        ranked list of cost by team tag value within selected date range.
    
    TODO:
    replace with run_query() against BigQuery
    aggregate SUM(net_amortised_cost) grouped by normalised_tags
    pull display_currency from organisations table in Postgres
    always include an untagged row for resources with no team tag — never drop unallocated costs

    TODO: COALESCE(team_tag, 'untagged') in SQL to catch null tags
    TODO: inject untagged row with 0.00 if missing from query results — never silently drop

    """
    return MetricTeamSpendResponse(
        rows = [
            MetricTeamSpendRowResponse(team="backend", net_amortised_cost=22100.00, percent_of_total=45.7), 
            MetricTeamSpendRowResponse(team="data", net_amortised_cost=14200.00, percent_of_total=29.4), 
            MetricTeamSpendRowResponse(team="frontend", net_amortised_cost=6100.00, percent_of_total=12.6),
            MetricTeamSpendRowResponse(team="untagged", net_amortised_cost=5920.50, percent_of_total=12.3)
            ],
        currency = "GBP"
    )
