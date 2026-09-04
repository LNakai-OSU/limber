import { useEffect, useState } from "react";
import { getExercisesForRegion, getRegions } from "../api";
import BodySilhouette from "./BodySilhouette";
import ExerciseList from "./ExerciseList";

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
        Switch between front and back, then click a highlighted point closest to the area.
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem", minWidth: 260 }}>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button className={`btn btn-secondary ${view === "front" ? "active" : ""}`} onClick={() => setView("front")}>
              Front
            </button>
            <button className={`btn btn-secondary ${view === "back" ? "active" : ""}`} onClick={() => setView("back")}>
              Back
            </button>
          </div>
          <BodySilhouette view={view} regions={regions} activeRegion={activeRegion} onSelect={selectRegion} />
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          {!activeRegion && <p className="empty-state">Select a point on the diagram to see exercises for that area.</p>}
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
