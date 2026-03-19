# src/models/focus.py
from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, field_validator


class FocusCostRow(BaseModel):
    # --- Required fields — never nullable ---
    org_id: str
    billed_cost: Decimal
    effective_cost: Decimal
    charge_period_start: date
    charge_period_end: date
    charge_type: str        # Usage | Purchase | Tax | Credit | Adjustment
    provider: str           # AWS | GCP | Azure | OpenAI | Anthropic
    service_name: str
    region_name: str

    resource_id: Optional[str] = None
    resource_name: Optional[str] = None
    tags: dict[str, str] = {}

    @field_validator("billed_cost", "effective_cost")
    @classmethod
    def cost_must_not_be_negative(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("Cost must not be negative")
        return v

    @field_validator("charge_type")
    @classmethod
    def charge_type_must_be_valid(cls, v: str) -> str:
        valid = {"Usage", "Purchase", "Tax", "Credit", "Adjustment"}
        if v not in valid:
            raise ValueError(f"charge_type must be one of {valid}")
        return v

    @field_validator("provider")
    @classmethod
    def provider_must_be_valid(cls, v: str) -> str:
        valid = {"AWS", "GCP", "Azure", "OpenAI", "Anthropic"}
        if v not in valid:
            raise ValueError(f"provider must be one of {valid}")
        return v
