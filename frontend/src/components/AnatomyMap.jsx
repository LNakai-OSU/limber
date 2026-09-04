import { useEffect, useState } from "react";
import { getExercisesForRegion, getRegions } from "../api";
import BodySilhouette from "./BodySilhouette";
import ExerciseList from "./ExerciseList";

const VIEWS = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "side", label: "Side" },
];

export default function AnatomyMap() {
  const [regions, setRegions] = useState([]);
  const [view, setView] = useState("front");
  const [activeRegion, setActiveRegion] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRegions().then(setRegions).catch((e) => setError(e.message));
  }, []);

  async function selectRegion(regionId) {
    setActiveRegion(regionId);
    setError(null);
    try {
      const res = await getExercisesForRegion(regionId);
      setExercises(res);
    } catch (e) {
      setError(e.message);
      setExercises([]);
    }
  }

  const activeLabel = regions.find((r) => r.id === activeRegion)?.label;

  return (
    <div>
      <h2 className="section-heading">Click where it hurts</h2>
      <p style={{ color: "var(--ink-soft)", marginBottom: "1rem" }}>
        Switch between front, back, and side, then click a highlighted muscle group closest to the area.
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem", minWidth: 280 }}>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {VIEWS.map((v) => (
              <button
                key={v.id}
                className={`btn btn-secondary ${view === v.id ? "active" : ""}`}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <BodySilhouette view={view} activeRegion={activeRegion} onSelect={selectRegion} />
          <p style={{ fontSize: "0.78rem", color: "var(--ink-faint)", textAlign: "center" }}>
            Hover to see a muscle name, click to see exercises for that group.
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          {!activeRegion && <p className="empty-state">Select a muscle group on the diagram to see exercises for that area.</p>}
          {activeRegion && (
            <>
              <h3 style={{ marginBottom: "0.75rem" }}>{activeLabel}</h3>
              {error && <p className="caution" style={{ display: "inline-block", marginBottom: "0.75rem" }}>{error}</p>}
              <ExerciseList exercises={exercises} emptyLabel="No exercises found for this area yet." />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
