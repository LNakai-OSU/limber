"""
Semantic matching between a free-text description of pain/discomfort and the
curated exercise library. Same embed-a-query-and-a-corpus-into-one-space,
rank-by-cosine-similarity pattern used for Shelf Match's book search - each
exercise's searchable text is its name + description + targeted muscles, so a
query like "my lower back is stiff after sitting all day" lands on entries
about lower-back and hip-flexor tightness even though it shares no keywords
with them.
"""

import json
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

DATA_DIR = Path(__file__).parent / "data"

_model = None
_exercises = None
_corpus_embeddings = None


def _searchable_text(exercise):
    return f"{exercise['name']}. {exercise['description']} Targets: {exercise['targets']}."


def load():
    global _model, _exercises, _corpus_embeddings
    with open(DATA_DIR / "exercises.json") as f:
        _exercises = json.load(f)
    _model = SentenceTransformer("all-MiniLM-L6-v2")
    texts = [_searchable_text(e) for e in _exercises]
    _corpus_embeddings = _model.encode(texts, normalize_embeddings=True)


MIN_RELEVANCE_SCORE = 0.35


def search(query, top_k=8, min_score=MIN_RELEVANCE_SCORE):
    query_vec = _model.encode([query], normalize_embeddings=True)[0]
    scores = _corpus_embeddings @ query_vec
    ranked = np.argsort(-scores)
    results = []
    for i in ranked:
        if scores[i] < min_score or len(results) >= top_k:
            break
        results.append({**_exercises[i], "match_score": float(scores[i])})
    return results


def all_exercises():
    return _exercises


def by_region(region_id):
    return [e for e in _exercises if region_id in e["regions"]]
