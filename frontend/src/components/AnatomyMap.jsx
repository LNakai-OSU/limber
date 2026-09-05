import { useEffect, useState } from "react";
import { getExercisesForRegion, getRegions } from "../api";
import BodySilhouette from "./BodySilhouette";
import ExerciseList from "./ExerciseList";

const VIEWS = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
];

export default function AnatomyMap() {
  const [regions, setRegions] = useState([]);
  const [view, setView] = useState("front");
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeLabel, setActiveLabel] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRegions().then(setRegions).catch((e) => setError(e.message));
  }, []);

  async function selectRegion(regionId, label) {
    setActiveRegion(regionId);
    setActiveLabel(label || regions.find((r) => r.id === regionId)?.label);
    setError(null);
    try {
      const res = await getExercisesForRegion(regionId);
      setExercises(res);
    } catch (e) {
      setError(e.message);
      setExercises([]);
    }
  }

  return (
    <div>
      <h2 className="section-heading md-headline-small">Click where it hurts</h2>
      <p className="md-body-medium" style={{ color: "var(--md-sys-color-on-surface-variant)", marginBottom: "1rem" }}>
        Switch between front and back, then click a highlighted muscle closest to the area. Major muscles are real
        anatomical illustrations; smaller joints are marked with a simple point.
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="m3-card m3-card-filled" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem", minWidth: 280 }}>
          <div className="m3-segmented">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                className={`m3-segment ${view === v.id ? "is-selected" : ""}`}
                onClick={() => setView(v.id)}
              >
                {view === v.id ? "✓ " : ""}
                {v.label}
              </button>
            ))}
          </div>
          <BodySilhouette view={view} activeRegion={activeRegion} onSelect={selectRegion} />
          <p className="md-body-small" style={{ color: "var(--md-sys-color-on-surface-variant)", textAlign: "center" }}>
            Hover to see a muscle name, click to see exercises for that group.
          </p>
          <p className="md-label-small" style={{ color: "var(--md-sys-color-on-surface-variant)", textAlign: "center" }}>
            Muscle illustrations from{" "}
            <a href="https://wger.de" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
              wger.de
            </a>{" "}
            (CC BY-SA 4.0)
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          {!activeRegion && <p className="empty-state md-body-medium">Select a muscle group on the diagram to see exercises for that area.</p>}
          {activeRegion && (
            <>
              <h3 className="md-title-large" style={{ marginBottom: "0.75rem" }}>{activeLabel}</h3>
              {error && <p className="caution md-body-small" style={{ display: "inline-block", marginBottom: "0.75rem" }}>{error}</p>}
              <ExerciseList exercises={exercises} emptyLabel="No exercises found for this area yet." />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
