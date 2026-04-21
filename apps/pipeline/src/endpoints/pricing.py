from fastapi import APIRouter, Query
from datetime import datetime
from src.models.responses import PricingLookupResponse, PricingEstimateResponse
from src.models.requests import PricingEstimateRequest, PricingEstimateResource


router = APIRouter()


@router.get("/pricing/lookup", response_model=PricingLookupResponse)
async def get_pricing(
    provider: str = Query(...),
    region: str = Query(...),
    resource_type: str = Query(...),
    sku: str = Query(...),
):
        """
        internal utility endpoint called to find out cost of a specific resource.

        powers GitHub PR cost annotation feature - when a dev opens a PR to change infrastrucure, 
        this endpoint is triggered to annotate PR with estimated cost impact

        TODO:
        replace mock with Redis cache lookup using key: pricing:{provider}:{region}:{resource_type}:{sku}
        Temporal workflow (PricingRefreshWorkflow) populates Redis daily from AWS/GCP/Azure pricing APIs
        set freshness_warning=True when cached_at is approaching 25hr TTL
        on cache miss: return 404 — Temporal workflow may not have run yet
        pull display_currency from organisations table in Postgres

        """
        
        return PricingLookupResponse(
            provider= provider,
            region= region,
            sku= sku,
            price_per_unit= 0.0416,
            unit= "Hrs",
            currency= "USD",
            cached_at= datetime.fromisoformat("2025-03-14T02:00:00"),
            freshness_warning= False # freshness_warning tells Sarah’s UI to show a stale data warning
    )


@router.post("/pricing/estimate", response_model=PricingEstimateResponse)
async def post_pricing_estimate(request: PricingEstimateRequest):
    """
    second part of the GitHub PR cost annotation feature
    PricingRefreshWorkflow runs daily and invokes CSP APIs and loads prices into redis.

    this endpoint loops through the resources and looks each one up in redis by key: 
    (pricing:{provider}:{region}:{resource_type}:{sku})

    
    TODO:
    Loop through request.resources
    For each resource, look up price_per_unit from Redis using key: pricing:{provider}:{region}:{resource_type}:{sku}
    Multiply price_per_unit by count by hours in a month (730) to get monthly cost per resource
    Sum all resources together for the total


    EXAMPLE:
    resources (3x t3.medium + 1x db.t3.small):

    t3.medium is ~$0.0416/hr × 3 instances × 730hrs = ~$91/month
    db.t3.small is ~$0.034/hr × 1 instance × 730hrs = ~$25/month
    Total ~$116/month
    Daily = ~$3.87/day
    """
    return PricingEstimateResponse(
        monthly_cost = 116.00,
        daily_cost = 3.87,
        currency= "USD", 
        cached_at= datetime.fromisoformat("2025-03-14T02:00:00"),
        freshness_warning= False
    )
