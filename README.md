# Limber

A wellness app that suggests exercises and stretches for pain, discomfort, or
stiffness through three different ways of telling it what's wrong: describe it
in your own words, click where it hurts on a body diagram, or let it screen
your range of motion from a short video.

**This is a portfolio/learning project, not a medical product.** See
[Disclaimer](#disclaimer) below.

## The three input modes

**Describe it.** Type something like "my lower back is stiff after sitting at
a desk all day" and get back stretches ranked by actual relevance, not
keyword overlap. A sentence-transformer (`all-MiniLM-L6-v2`) embeds both the
query and every exercise's name/description/target-muscle text into the same
vector space at startup, then ranks by cosine similarity - the same
embed-and-rank pattern used for [Shelf Match](https://github.com/LNakai-OSU/shelf-match)'s
book search, applied to a much smaller, hand-written corpus.

**Click where it hurts.** A custom SVG body diagram (front and back views,
20 clickable regions from neck and jaw down to feet, including specific
areas like the IT band and piriformis) shows exercises tagged to that
region. It's a deliberately simplified paper-doll figure, not an
anatomically accurate rendering - the goal is an obvious click target, not a
medical illustration.

**Movement check.** Pick a guided movement (e.g. "raise your arm overhead as
far as comfortable"), and [MediaPipe Pose](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker)
tracks your joint angle live from your webcam or an uploaded clip - entirely
in the browser via WASM. The peak angle you reach is compared against a
generic, commonly-cited "typical unrestricted range" for that movement, and
if it comes in noticeably lower, you get exercises for that joint. **The
video frames never leave your browser** - only the single peak angle number
is sent to the backend.

## Data: hand-curated, not scraped

Every exercise/stretch (about 50, covering neck, jaw, shoulders, chest,
upper/lower back, core, hips, glutes, piriformis, IT band, hamstrings, quads,
knees, calves, ankles, feet, wrists, forearms, and elbows) was written for
this project rather than pulled from an existing database. I looked at
[wger.de](https://wger.de/en/software/features)'s open exercise API early on
- it's a real, well-built dataset, but it's a general gym/strength-training
catalog (deadlifts, kettlebell swings), not a pain-relief/mobility one, so
its content wouldn't actually answer "what helps my stiff neck." For
health-adjacent content, a small, deliberately curated set of
well-established, low-risk stretches beat a larger but mismatched one.

Each entry includes steps, what it targets, equipment needed, difficulty, and
an honest caution (e.g. "if you feel shooting pain down the leg rather than a
local stretch, stop and consider seeing a clinician").

## What's real vs. approximate

- The semantic search is a genuine embedding model doing genuine similarity
  ranking - not a keyword lookup table.
- The range-of-motion "normal" values are generic, commonly-cited active-range
  figures (the kind found in physical therapy references), not personalized
  or clinically validated for any individual.
- The angle itself is a simple 2D vector angle computed from three pose
  landmarks in the camera's image plane - it's a reasonable screening proxy,
  not a true 3D biomechanical joint angle, and it's sensitive to camera angle
  and how "sideways" you actually are to the camera.
- Only one person is tracked at a time, and the model runs the lightweight
  MediaPipe pose variant for browser performance, not the most accurate one.

## Tech stack

- **Backend:** FastAPI, sentence-transformers, NumPy
- **Frontend:** React + Vite, `@mediapipe/tasks-vision` (client-side pose
  estimation), hand-built SVG body diagram
- No database - the exercise/region/ROM-test data is static, hand-authored
  JSON loaded at startup

## Running it locally

```bash
# backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Disclaimer

Limber suggests general wellness stretches and mobility exercises based on
common, well-established movements. It does not diagnose any condition,
interpret medical images or symptoms, or replace a doctor or physical
therapist. The range-of-motion screening is a rough, browser-based estimate
for general awareness, not a clinical measurement. If you have severe,
worsening, or radiating pain, numbness, or a recent injury, please seek
professional care instead of relying on this app.
