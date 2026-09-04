import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import rom_assess, semantic_search

DATA_DIR = Path(__file__).parent / "data"


@asynccontextmanager
async def lifespan(app: FastAPI):
    semantic_search.load()
    yield


app = FastAPI(title="Limber API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/regions")
def get_regions():
    with open(DATA_DIR / "regions.json") as f:
        return json.load(f)


@app.get("/api/regions/{region_id}/exercises")
def get_region_exercises(region_id: str):
    results = semantic_search.by_region(region_id)
    if not results:
        raise HTTPException(status_code=404, detail=f"No exercises found for region '{region_id}'")
    return results


class SearchRequest(BaseModel):
    query: str
    top_k: int = 8


@app.post("/api/search")
def search(req: SearchRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return semantic_search.search(req.query, top_k=req.top_k)


@app.get("/api/rom-tests")
def get_rom_tests():
    return rom_assess.list_tests()


class AssessRequest(BaseModel):
    test_id: str
    peak_angle_deg: float


@app.post("/api/assess")
def assess(req: AssessRequest):
    result = rom_assess.assess(req.test_id, req.peak_angle_deg)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Unknown test '{req.test_id}'")
    return result


@app.get("/api/health")
def health():
    return {"status": "ok"}
