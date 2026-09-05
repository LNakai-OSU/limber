const BASE = "http://localhost:8030";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export function getRegions() {
  return fetch(`${BASE}/api/regions`).then(handle);
}

export function getExercisesForRegion(regionId) {
  return fetch(`${BASE}/api/regions/${regionId}/exercises`).then(handle);
}

export function searchExercises(query, topK = 8) {
  return fetch(`${BASE}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  }).then(handle);
}

export function getRomTests() {
  return fetch(`${BASE}/api/rom-tests`).then(handle);
}

export function assessRom(testId, peakAngleDeg) {
  return fetch(`${BASE}/api/assess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test_id: testId, peak_angle_deg: peakAngleDeg }),
  }).then(handle);
}
