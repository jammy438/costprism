import os

# STUB: Sarah's Supabase credentials not yet available.
# When she's back, set DATABASE_URL in .env and replace get_org_currency()
# with a real asyncpg query against the organisations table.
#
# Real query will be:
#   SELECT display_currency FROM organisations WHERE org_id = $1

STUB_CURRENCY = "GBP"


def get_org_currency(org_id: str) -> str:
    """
    Returns the display currency for an org.
    STUBBED — always returns GBP until Supabase is accessible.
    """
    return STUB_CURRENCY
