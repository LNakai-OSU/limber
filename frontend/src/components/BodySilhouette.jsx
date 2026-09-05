import { REAL_MUSCLES, REAL_MUSCLE_TRANSFORM } from "../data/realMuscles";
import { JOINT_MARKERS } from "../data/jointMarkers";

const SKIN = "var(--md-sys-color-surface-container-highest)";
const SKIN_LINE = "var(--md-sys-color-outline-variant)";

function Outline() {
  return (
    <g fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.5">
      <path d="M52,68 Q99,58 148,68 L133,180 Q99,190 65,180 Z" />
      <line x1="99" y1="46" x2="99" y2="62" stroke={SKIN} strokeWidth="15" strokeLinecap="round" />
      <circle cx="99" cy="25" r="22" />
      <line x1="56" y1="72" x2="46" y2="133" stroke={SKIN} strokeWidth="19" strokeLinecap="round" />
      <line x1="142" y1="72" x2="152" y2="133" stroke={SKIN} strokeWidth="19" strokeLinecap="round" />
      <line x1="46" y1="133" x2="38" y2="202" stroke={SKIN} strokeWidth="15" strokeLinecap="round" />
      <line x1="152" y1="133" x2="160" y2="202" stroke={SKIN} strokeWidth="15" strokeLinecap="round" />
      <circle cx="36" cy="215" r="9" />
      <circle cx="162" cy="215" r="9" />
      <line x1="70" y1="178" x2="72" y2="258" stroke={SKIN} strokeWidth="24" strokeLinecap="round" />
      <line x1="128" y1="178" x2="128" y2="258" stroke={SKIN} strokeWidth="24" strokeLinecap="round" />
      <line x1="72" y1="258" x2="76" y2="358" stroke={SKIN} strokeWidth="17" strokeLinecap="round" />
      <line x1="128" y1="258" x2="124" y2="358" stroke={SKIN} strokeWidth="17" strokeLinecap="round" />
      <ellipse cx="78" cy="378" rx="14" ry="8" />
      <ellipse cx="122" cy="378" rx="14" ry="8" />
    </g>
  );
}

// Real wger.de illustrations render in primary (the app's main color, since
// they're the hero content); plain joint markers render in tertiary, so the
// two content types (real art vs. honest placeholder) read as distinct roles
// by hue. Selection is signaled by intensity (opacity/stroke), not a third
// hue, so "which one is picked" stays legible without adding another color.
function RealMuscle({ muscle, view, isActive, onSelect }) {
  return (
    <g
      transform={REAL_MUSCLE_TRANSFORM[view]}
      onClick={() => onSelect(muscle.region, muscle.label)}
      className="muscle-shape"
      style={{ cursor: "pointer" }}
    >
      {muscle.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="var(--md-sys-color-primary)"
          fillOpacity={isActive ? 0.95 : 0.7}
          stroke="var(--md-sys-color-primary)"
          strokeOpacity={isActive ? 1 : 0.5}
          strokeWidth={isActive ? 3 : 1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <title>{muscle.label}</title>
    </g>
  );
}

function Marker({ m, isActive, onSelect }) {
  return (
    <g onClick={() => onSelect(m.region, m.label)} className="muscle-shape" style={{ cursor: "pointer" }}>
      <circle
        cx={m.cx}
        cy={m.cy}
        r={m.r}
        fill="var(--md-sys-color-tertiary)"
        fillOpacity={isActive ? 0.98 : 0.75}
        stroke="var(--md-sys-color-surface)"
        strokeWidth={isActive ? 2.5 : 1.5}
        vectorEffect="non-scaling-stroke"
      />
      <title>{m.label}</title>
    </g>
  );
}

export default function BodySilhouette({ view, activeRegion, onSelect }) {
  const muscles = REAL_MUSCLES[view] || [];
  const markers = JOINT_MARKERS[view] || [];

  return (
    <svg viewBox="0 0 200 400" style={{ width: "100%", maxWidth: 300, height: "auto" }}>
      <Outline />
      {muscles.map((mus, i) => (
        <RealMuscle key={i} muscle={mus} view={view} isActive={mus.region === activeRegion} onSelect={onSelect} />
      ))}
      {markers.map((m, i) => (
        <Marker key={i} m={m} isActive={m.region === activeRegion} onSelect={onSelect} />
      ))}
    </svg>
  );
}
