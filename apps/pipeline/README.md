# CostPrism Pipeline

George's data pipeline — FOCUS normalisation, cloud billing ingestion, and internal service endpoints.

## What this does
- Ingests raw billing data from AWS CUR, GCP, and Azure via Temporal workflows
- Normalises everything to FOCUS 1.3 schema in BigQuery
- Exposes internal HTTP endpoints that Sarah's API layer calls

## Tech
- Python 3.11
- Temporal.io (workflow engine)
- dbt (SQL transformations)
- FastAPI (internal endpoints)
- BigQuery (data warehouse)