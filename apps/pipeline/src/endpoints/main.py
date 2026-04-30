from fastapi import FastAPI
from src.endpoints.connectors import router as connectors_router
from src.endpoints.costs import router as costs_router
from src.endpoints.pipeline import router as pipeline_router
from src.endpoints.metrics import router as metrics_router
from src.endpoints.tags import router as tags_router
from src.endpoints.pricing import router as pricing_router
from src.endpoints.analytics import router as analytics_router

app = FastAPI(title="CostPrism Internal API")

app.include_router(connectors_router, prefix="/internal")
app.include_router(costs_router, prefix="/internal")
app.include_router(pipeline_router, prefix="/internal")
app.include_router(metrics_router, prefix="/internal")
app.include_router(tags_router, prefix="/internal")
app.include_router(pricing_router, prefix="/internal")
app.include_router(analytics_router, prefix="/internal")

@app.get("/health")
async def health():
    return {"status": "ok"}
