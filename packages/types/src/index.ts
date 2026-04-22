export interface User {
  id: string;
  name: string;
  email: string;
  orgId: string;
}

export interface Org {
  id: string;
  name: string;
}

export interface Connector {
  id: string;
  name: string;
  type: string;
  orgId: string;
}

export interface CostRow {
  org_id: string
  connector_id: string
  ingested_at: string
  data_format: string
  charge_period_start: string
  charge_period_end: string
  charge_type: 'Usage' | 'Purchase' | 'Tax' | 'Credit' | 'Adjustment'
  provider: string
  service_name: string
  region_name: string
  net_amortised_cost: number
  amortised_cost: number
  billed_cost: number
  original_currency: string
  original_amount: number
  display_currency: string
  display_amount: number
  exchange_rate: number
  exchange_rate_date: string
  resource_id: string | null
  resource_name: string | null
  tags: Record<string, string>
  normalised_tags: Record<string, string>
}
