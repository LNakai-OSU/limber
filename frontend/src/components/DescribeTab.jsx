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
      <h2 className="section-heading">Describe what's bothering you</h2>
      <p style={{ color: "var(--ink-soft)", marginBottom: "1rem" }}>
        Use your own words - "my lower back is stiff after sitting all day" works better than picking a body part.
      </p>
      <div className="card" style={{ padding: "1.1rem", marginBottom: "1rem" }}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the pain, discomfort, or stiffness you're feeling..."
          rows={3}
          style={{
            width: "100%",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.7rem",
            fontFamily: "inherit",
            fontSize: "0.95rem",
            resize: "vertical",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {EXAMPLES.map((ex) => (
              <button key={ex} className="chip" style={{ cursor: "pointer", border: "1px solid var(--border)" }} onClick={() => runSearch(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: "0.9rem" }} onClick={() => runSearch()} disabled={loading}>
          {loading ? "Searching..." : "Find exercises"}
        </button>
      </div>
      {error && <p className="caution" style={{ display: "inline-block" }}>{error}</p>}
      {results && <ExerciseList exercises={results} emptyLabel="No close matches - try describing it differently." />}
    </div>
  );
}
