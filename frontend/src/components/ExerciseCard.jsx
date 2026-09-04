import MoveDemo from "./MoveDemo";

export default function ExerciseCard({ exercise }) {
  return (
    <div className="card exercise-card" data-difficulty={exercise.difficulty}>
      <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
        {exercise.demo && <MoveDemo archetype={exercise.demo} />}
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
    </div>
  );
}
