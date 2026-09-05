import { useState } from "react";
import { searchExercises } from "../api";
import ExerciseList from "./ExerciseList";

const EXAMPLES = [
  "my lower back is stiff after sitting at a desk all day",
  "tight hips from running, especially the outer thigh",
  "my neck and shoulders are tense from looking at my phone",
  "stiff ankles when I go down stairs",
  "sharp tightness on the outside of my elbow from typing",
];

export default function DescribeTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function runSearch(text) {
    const q = text ?? query;
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setError(null);
    try {
      const res = await searchExercises(q);
      setResults(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="section-heading md-headline-small">Describe what's bothering you</h2>
      <p className="md-body-medium" style={{ color: "var(--md-sys-color-on-surface-variant)", marginBottom: "1rem" }}>
        Use your own words - "my lower back is stiff after sitting all day" works better than picking a body part.
      </p>
      <div className="m3-card m3-card-filled" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
        <div className="m3-field">
          <label htmlFor="describe-input">What's bothering you</label>
          <textarea
            id="describe-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the pain, discomfort, or stiffness you're feeling..."
            rows={3}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.9rem" }}>
          {EXAMPLES.map((ex) => (
            <button key={ex} className="m3-chip md-label-large" onClick={() => runSearch(ex)}>
              {ex}
            </button>
          ))}
        </div>
        <button className="m3-button m3-button-filled md-label-large" style={{ marginTop: "1rem" }} onClick={() => runSearch()} disabled={loading}>
          {loading ? "Searching..." : "Find exercises"}
        </button>
      </div>
      {error && <p className="caution md-body-small" style={{ display: "inline-block" }}>{error}</p>}
      {results && <ExerciseList exercises={results} emptyLabel="No close matches - try describing it differently." />}
    </div>
  );
}
