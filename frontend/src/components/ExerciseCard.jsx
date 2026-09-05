import { useState } from "react";
import MoveDemo from "./MoveDemo";
import Movement3DViewer from "./Movement3DViewer";

export default function ExerciseCard({ exercise }) {
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="m3-card m3-card-elevated exercise-card">
      <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
        {exercise.demo && (
          <div style={{ position: "relative" }}>
            <MoveDemo archetype={exercise.demo} />
            <button
              onClick={() => setShow3D(true)}
              title="View in 3D"
              className="md-label-small"
              style={{
                position: "absolute",
                bottom: -6,
                right: -6,
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "none",
                background: "var(--md-sys-color-primary)",
                color: "var(--md-sys-color-on-primary)",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "var(--md-sys-elevation-1)",
              }}
            >
              3D
            </button>
          </div>
        )}
        <h3 className="md-title-medium" style={{ flex: 1 }}>{exercise.name}</h3>
      </div>
      <div className="meta-row">
        <span className="m3-chip md-label-large">{exercise.equipment === "none" ? "No equipment" : exercise.equipment}</span>
        <span
          className="m3-chip md-label-large"
          style={
            exercise.difficulty === "medium"
              ? { background: "var(--md-sys-color-tertiary-container)", color: "var(--md-sys-color-on-tertiary-container)", borderColor: "transparent" }
              : { background: "var(--md-sys-color-secondary-container)", color: "var(--md-sys-color-on-secondary-container)", borderColor: "transparent" }
          }
        >
          {exercise.difficulty}
        </span>
        {typeof exercise.match_score === "number" && (
          <span className="m3-chip md-label-large">match {(exercise.match_score * 100).toFixed(0)}%</span>
        )}
      </div>
      <p className="md-body-medium">{exercise.description}</p>
      <ol className="steps md-body-medium">
        {exercise.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <p className="md-body-small" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Targets: {exercise.targets}</p>
      {exercise.cautions && <p className="caution md-body-small">{exercise.cautions}</p>}

      {show3D && <Movement3DViewer archetype={exercise.demo} onClose={() => setShow3D(false)} />}
    </div>
  );
}
