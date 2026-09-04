import { useState } from "react";
import MoveDemo from "./MoveDemo";
import Movement3DViewer from "./Movement3DViewer";

export default function ExerciseCard({ exercise }) {
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="card exercise-card" data-difficulty={exercise.difficulty}>
      <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
        {exercise.demo && (
          <div style={{ position: "relative" }}>
            <MoveDemo archetype={exercise.demo} />
            <button
              onClick={() => setShow3D(true)}
              title="View in 3D"
              style={{
                position: "absolute",
                bottom: -6,
                right: -6,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: "var(--primary)",
                color: "#fbf6ea",
                fontSize: "0.65rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              3D
            </button>
          </div>
        )}
        <h3 style={{ flex: 1 }}>{exercise.name}</h3>
      </div>
      <div className="meta-row">
        <span className="chip">{exercise.equipment === "none" ? "No equipment" : exercise.equipment}</span>
        <span className="chip">{exercise.difficulty}</span>
        {typeof exercise.match_score === "number" && (
          <span className="chip">match {(exercise.match_score * 100).toFixed(0)}%</span>
        )}
      </div>
      <p>{exercise.description}</p>
      <ol className="steps">
        {exercise.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <p style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>Targets: {exercise.targets}</p>
      {exercise.cautions && <p className="caution">{exercise.cautions}</p>}

      {show3D && <Movement3DViewer archetype={exercise.demo} onClose={() => setShow3D(false)} />}
    </div>
  );
}
