import uuid
from fastapi import APIRouter, Query

from src.models.requests import PipelineTriggerRequest
from src.models.responses import PipelineTriggerResponse


router = APIRouter()


@router.post("/pipeline/trigger")
async def post_trigger_pipeline(request: PipelineTriggerRequest):
    """
    UI sends requests for job_id and status by passing in org_id and connector_id.
    Triggers a sync

    TODO:
    once temporal is live will trigger:
    temporal_client.start_workflow(IngestionWorkflow, ...)
    """
    job_id = f"job_{uuid.uuid4().hex[:8]}"
    return PipelineTriggerResponse(
        job_id= job_id,
        status= "queued"
    )


@router.get("/pipeline/status/{job_id}")
async def get_pipeline_status(job_id: str, org_id: str = Query(...)):
    """
    Return status of the temporal workflow job / running sync

    TODO:
    - query connectors table in Postgres by job_id AND org_id
    - verify job belongs to that org before returning status
    - return sync_status, last_sync_row_count, last_error_message
    """
    return {"job_id": job_id, "status": "complete", "row_count": 42310, "error": None}
