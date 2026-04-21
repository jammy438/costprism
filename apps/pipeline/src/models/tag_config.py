from pydantic import BaseModel

# Postgres table: tag_config
class TagConfig(BaseModel):
    org_id: str
    # Populated AFTER discovery — empty for new orgs
    required_tag_keys: list[str] = []
    # Whether to apply best-guess normalisation
    enable_normalisation: bool = True
    # Custom normalisation rules the customer defines
    # e.g. {"frontend": ["fe", "front-end", "FrontEnd"]}
    custom_bundles: dict[str, list[str]] = {}