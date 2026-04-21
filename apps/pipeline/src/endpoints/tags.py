from fastapi import APIRouter, Query
from src.models.responses import TagsDiscoveredResponse, TagsDiscoveredKeysResponse, TagsNormalisedKeysResponse, TagsNormalisedResponse


router = APIRouter()


@router.get("/tags/discovered", response_model=TagsDiscoveredKeysResponse)
async def get_discovered_tags(org_id: str = Query(...)):
    """

    Note: field names deviate from guide — spend_covered_gbp renamed to spend_covered
    currency field added to response for multi-currency support

    Powers the tag discovery view.

    Returns every tag key found across the org’s resources, 
    sorted by spend. For each key, it also shows 
    variant keys — the different versions of the same tag (env, Env, ENV, environment) detected.

    TODO:
    replace mock with run_query() against BigQuery
    calculate spend_covered as SUM(net_amortised_cost) grouped by tag key for discovered_keys
    calculate total_spend as SUM(net_amortised_cost) across all rows
    calculate untagged_spend as SUM(net_amortised_cost) WHERE tag fields are NULL
    pull display_currency from organisations table in Postgres
    """
    return TagsDiscoveredKeysResponse(
        discovered_keys=[
        TagsDiscoveredResponse(
            key="environment",
            resources_tagged=312,
            spend_covered=38400.00,
            variants_found=["env", "Env", "ENV", "environment", "ENVIRONMENT"],
            top_values=["production", "staging", "dev"]),
        TagsDiscoveredResponse(
            key="team",
            resources_tagged=248,
            spend_covered=29100.00,
            variants_found=["team", "Team", "squad"],
            top_values=["backend", "data", "frontend"]),
        TagsDiscoveredResponse(
            key="cost-centre",
            resources_tagged=98,
            spend_covered=11200.00,
            variants_found=["cost-centre", "costcentre", "cost_centre"],
            top_values=["engineering", "platform"])
            ],
        untagged_spend = 8620.50,
        total_spend = 87320.50,
        currency="GBP"
    )


@router.get("/tags/normalised", response_model=TagsNormalisedKeysResponse)
async def get_normalised_tags(org_id: str = Query(...)):
    """
    powers the dashboard charts that break down spend by tag.

    combines data from bigquery normalised tags table or focus row table TBC with 
    normalised rules in postgres
    e.g. treat env and Env as environment.

    TODO:
    query BigQuery for raw tag data from FOCUS rows
    query Postgres for normalisation bundles configured by Oli
    apply bundles to group variant tags under canonical keys
    pull display_currency from organisations table in Postgres
    consider materialised tags table in BigQuery for performance at scale
    """
    return TagsNormalisedKeysResponse(
        normalised_keys=[
        TagsNormalisedResponse(
            canonical_key = "environment",
            canonical_values = {
                "production": ["prod", "production", "prd", "PROD"],
                "staging":    ["staging", "stg", "pre-prod"],
                "development":["dev", "development", "Dev"],
            },
            resources_normalised = 312,
            spend_covered = 38400.00
            )
            ],
        currency="GBP"
        )
    
