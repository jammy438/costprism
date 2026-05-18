import os
from google.cloud import bigquery
from dotenv import load_dotenv


load_dotenv()

def _get_client():
    """
    Creates a BigQuery client using the service account JSON
    specified in GOOGLE_APPLICATION_CREDENTIALS.
    """
    project = os.getenv("BIGQUERY_PROJECT_ID")
    if not project:
        raise ValueError("BIGQUERY_PROJECT_ID environment variable is not set")
    return bigquery.Client(project=project)


def run_query(sql: str, params: list) -> list[dict]:
    """
    Runs a parameterised BigQuery query and returns results as a list of dicts.

    Args:
        sql:    The SQL string, using @param_name placeholders
        params: List of bigquery.ScalarQueryParameter objects

    Returns:
        List of row dicts
    """
    client = _get_client()
    job_config = bigquery.QueryJobConfig(query_parameters=params)
    result = client.query(sql, job_config=job_config).result()
    return [dict(row) for row in result]
