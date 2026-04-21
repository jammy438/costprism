from pydantic import BaseModel

# Postgres table: anomaly_config
class AnomalyConfig(BaseModel):
    org_id: str
    sigma_threshold: float = 3.0
    absolute_floor_gbp: float = 5.00
    percentage_floor: float = 0.50
    lookback_days: int = 14
    suppression_days: int = 7