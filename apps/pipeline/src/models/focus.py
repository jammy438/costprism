from pydantic import BaseModel, field_validator, model_validator
from datetime import date
from decimal import Decimal
from typing import Optional
from enum import Enum


class ChargeType(str, Enum):
    USAGE      = "Usage"
    PURCHASE   = "Purchase"
    TAX        = "Tax"
    CREDIT     = "Credit"
    ADJUSTMENT = "Adjustment"

class DataFormat(str, Enum):
    FOCUS_1_3   = "focus_1_3"    # native FOCUS export — primary path
    AWS_CUR     = "aws_cur"      # legacy adapter
    GCP_BILLING = "gcp_billing"  # legacy adapter
    AZURE_COST  = "azure_cost"   # legacy adapter

class CostMetric(str, Enum):
    NET_AMORTISED = "net_amortised"
    AMORTISED     = "amortised"
    BILLED        = "billed"

class FocusCostRow(BaseModel):

    # ── Identity ───────────────────────────────────
    org_id:       str
    connector_id: str
    ingested_at:  date
    data_format:  DataFormat  # which pipeline path produced this row

    # ── FOCUS core fields ──────────────────────────
    charge_period_start: date
    charge_period_end:   date
    charge_type:         ChargeType
    provider:            str   # AWS | GCP | Azure | OpenAI | Anthropic etc
    service_name:        str
    region_name:         str

    # ── Cost fields — all three required ───────────
    # Oli's decision: store all three, display net_amortised by default
    net_amortised_cost: Decimal   # PRIMARY — amortised minus credits/discounts
    amortised_cost:     Decimal   # RI and SP fees spread daily, before credits
    billed_cost:        Decimal   # raw bill before any discounts

    # ── Currency fields ────────────────────────────
    # George normalises to display_currency in the pipeline
    # Sarah reads display_amount for the UI
    original_currency:  str       # e.g. "USD" — what the provider billed in
    original_amount:    Decimal   # the raw amount in original_currency
    display_currency:   str       # e.g. "GBP" — the org's chosen currency
    display_amount:     Decimal   # converted amount for UI display
    exchange_rate:      Decimal   # rate used for conversion
    exchange_rate_date: date      # which day's rate was used

    # ── Optional FOCUS fields ──────────────────────
    resource_id:   Optional[str] = None
    resource_name: Optional[str] = None

    # ── Tags ───────────────────────────────────────
    # Raw tags as they arrived — no normalisation applied yet
    tags: dict[str, str] = {}
    # Normalised tags after best-guess bundling
    # e.g. "env" -> "environment", "prd" -> "production"
    normalised_tags: dict[str, str] = {}

    # ── Validators ────────────────────────────────
    @field_validator("net_amortised_cost", "amortised_cost", "billed_cost")
    @classmethod
    def costs_not_negative(cls, v):
        if v < 0:
            raise ValueError("Cost fields must not be negative")
        return v

    @field_validator("exchange_rate")
    @classmethod
    def rate_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Exchange rate must be positive")
        return v

    @model_validator(mode="after")
    def net_amortised_lte_amortised(self):
        # Net amortised should always be <= amortised
        # (credits and discounts reduce the amortised figure)
        if self.net_amortised_cost > self.amortised_cost:
            raise ValueError(
                "net_amortised_cost cannot exceed amortised_cost — "
                "credits and discounts should reduce the figure"
            )
        return self

    def cost_for_display(self) -> Decimal:
        """Returns the primary metric for dashboard display."""
        return self.net_amortised_cost

    def cost_by_metric(self, metric: CostMetric) -> Decimal:
        """Lets Sarah's API request a specific cost variant."""
        return {
            CostMetric.NET_AMORTISED: self.net_amortised_cost,
            CostMetric.AMORTISED:     self.amortised_cost,
            CostMetric.BILLED:        self.billed_cost,
        }[metric]