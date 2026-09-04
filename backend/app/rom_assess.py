"""
Turns a peak joint angle (already computed client-side from MediaPipe Pose
landmarks - the video itself never leaves the browser) into a plain-language
screening note plus exercise suggestions. This is deliberately a threshold
lookup against generic, commonly-cited active-range norms, not a diagnostic
model - see the hedged wording in each test's `note` field in rom_tests.json.
"""

import json
from pathlib import Path

from . import semantic_search

DATA_DIR = Path(__file__).parent / "data"

with open(DATA_DIR / "rom_tests.json") as f:
    ROM_TESTS = json.load(f)

TESTS_BY_ID = {t["id"]: t for t in ROM_TESTS}


def list_tests():
    return ROM_TESTS


def assess(test_id, peak_angle_deg):
    test = TESTS_BY_ID.get(test_id)
    if test is None:
        return None

    limited = False
    if test.get("limited_below_deg") is not None and peak_angle_deg < test["limited_below_deg"]:
        limited = True
    if test.get("limited_above_deg") is not None and peak_angle_deg > test["limited_above_deg"]:
        limited = True

    lo, hi = test["normal_range_deg"]
    if limited:
        headline = f"Your peak angle was about {peak_angle_deg:.0f}°, a bit below the typical unrestricted range (roughly {lo}-{hi}°)."
        suggestion = "This may suggest some stiffness worth working on - here are some general mobility exercises people commonly use for this area."
    else:
        headline = f"Your peak angle was about {peak_angle_deg:.0f}°, within the typical unrestricted range (roughly {lo}-{hi}°)."
        suggestion = "Range looks solid - these general mobility exercises can help you maintain it."

    exercises = []
    for region in test["regions"]:
        exercises.extend(semantic_search.by_region(region))
    seen = set()
    deduped = []
    for e in exercises:
        if e["id"] not in seen:
            seen.add(e["id"])
            deduped.append(e)

    return {
        "test_id": test_id,
        "peak_angle_deg": peak_angle_deg,
        "limited": limited,
        "headline": headline,
        "suggestion": suggestion,
        "exercises": deduped[:8],
    }
