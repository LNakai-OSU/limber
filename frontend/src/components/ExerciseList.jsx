import ExerciseCard from "./ExerciseCard";

export default function ExerciseList({ exercises, emptyLabel }) {
  if (!exercises || exercises.length === 0) {
    return <p className="empty-state">{emptyLabel || "Nothing to show yet."}</p>;
  }
  return (
    <div className="exercise-grid">
      {exercises.map((e) => (
        <ExerciseCard key={e.id} exercise={e} />
      ))}
    </div>
  );
}
