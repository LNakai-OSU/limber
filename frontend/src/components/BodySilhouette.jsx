import { MUSCLE_VIEWS } from "../data/muscleMap";

const SKIN = "#2a323f";
const SKIN_LINE = "#3a4557";

function StandingOutline({ back }) {
  return (
    <g fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.5">
      <path d="M63,88 Q100,78 137,88 L128,222 Q100,232 72,222 Z" />
      <path d="M72,220 L128,220 L120,240 L80,240 Z" />
      <line x1="100" y1="58" x2="100" y2="75" stroke={SKIN} strokeWidth="18" strokeLinecap="round" />
      <circle cx="100" cy="35" r="24" />
      <line x1="62" y1="95" x2="42" y2="182" stroke={SKIN} strokeWidth="22" strokeLinecap="round" />
      <line x1="138" y1="95" x2="158" y2="182" stroke={SKIN} strokeWidth="22" strokeLinecap="round" />
      <line x1="42" y1="182" x2="30" y2="270" stroke={SKIN} strokeWidth="18" strokeLinecap="round" />
      <line x1="158" y1="182" x2="170" y2="270" stroke={SKIN} strokeWidth="18" strokeLinecap="round" />
      <circle cx="29" cy="277" r="11" />
      <circle cx="171" cy="277" r="11" />
      <line x1="80" y1="236" x2="78" y2="345" stroke={SKIN} strokeWidth="28" strokeLinecap="round" />
      <line x1="120" y1="236" x2="122" y2="345" stroke={SKIN} strokeWidth="28" strokeLinecap="round" />
      <line x1="78" y1="345" x2="78" y2="452" stroke={SKIN} strokeWidth="20" strokeLinecap="round" />
      <line x1="122" y1="345" x2="122" y2="452" stroke={SKIN} strokeWidth="20" strokeLinecap="round" />
      <ellipse cx="80" cy="472" rx="16" ry="10" />
      <ellipse cx="120" cy="472" rx="16" ry="10" />
      {back ? (
        <line x1="100" y1="90" x2="100" y2="218" stroke={SKIN_LINE} strokeWidth="1" strokeDasharray="3,4" fill="none" />
      ) : (
        <>
          <circle cx="92" cy="32" r="2.2" fill={SKIN_LINE} stroke="none" />
          <circle cx="108" cy="32" r="2.2" fill={SKIN_LINE} stroke="none" />
        </>
      )}
    </g>
  );
}

function ProfileOutline() {
  return (
    <g fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.5">
      <path d="M70,88 Q98,78 120,90 L112,222 Q90,230 78,220 Z" />
      <path d="M78,220 L112,222 L106,241 L82,238 Z" />
      <line x1="94" y1="58" x2="96" y2="76" stroke={SKIN} strokeWidth="17" strokeLinecap="round" />
      <circle cx="93" cy="35" r="24" />
      <path d="M104,42 Q120,46 113,55 Q104,53 100,45 Z" />
      <line x1="72" y1="96" x2="65" y2="182" stroke={SKIN} strokeWidth="21" strokeLinecap="round" />
      <line x1="65" y1="182" x2="58" y2="270" stroke={SKIN} strokeWidth="17" strokeLinecap="round" />
      <circle cx="57" cy="277" r="10" />
      <line x1="92" y1="236" x2="94" y2="345" stroke={SKIN} strokeWidth="27" strokeLinecap="round" />
      <line x1="94" y1="345" x2="96" y2="452" stroke={SKIN} strokeWidth="19" strokeLinecap="round" />
      <ellipse cx="104" cy="472" rx="18" ry="9" />
    </g>
  );
}

export default function BodySilhouette({ view, activeRegion, onSelect }) {
  const muscles = MUSCLE_VIEWS[view] || [];
  const viewBox = "0 0 200 500";

  return (
    <svg viewBox={viewBox} style={{ width: "100%", maxWidth: 280, height: "auto" }}>
      {view === "side" ? <ProfileOutline /> : <StandingOutline back={view === "back"} />}

      {muscles.map((m, i) => {
        const isActive = m.region === activeRegion;
        return (
          <g
            key={`${m.region}-${i}`}
            onClick={() => onSelect(m.region)}
            style={{ cursor: "pointer" }}
            className="muscle-shape"
          >
            <ellipse
              cx={m.cx}
              cy={m.cy}
              rx={m.rx}
              ry={m.ry}
              transform={m.rotate ? `rotate(${m.rotate} ${m.cx} ${m.cy})` : undefined}
              fill={isActive ? "var(--accent)" : "var(--muscle)"}
              fillOpacity={isActive ? 0.95 : 0.75}
              stroke={isActive ? "var(--accent)" : "var(--muscle-bright)"}
              strokeWidth="1"
            />
            <title>{m.label}</title>
          </g>
        );
      })}
    </svg>
  );
}
