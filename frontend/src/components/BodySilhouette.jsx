import { MUSCLE_VIEWS } from "../data/muscleMap";

const SKIN = "#e9dcc0";
const SKIN_LINE = "#cbb98f";

// Unit muscle-belly shapes, each spanning roughly -0.5..0.5 in both axes,
// drawn once and reused via an SVG transform (translate/rotate/scale) per
// instance - see muscleMap.js. Organic bezier tapers instead of ellipses so
// they actually read as a muscle belly (fuller toward one end, tapering at
// the tendons) rather than a uniform blob.
const SHAPES = {
  // tapers to a point at the top, rounds out at the bottom - limb muscles
  spindle: "M0,-0.5 C0.3,-0.42 0.42,-0.2 0.37,0.05 C0.33,0.26 0.2,0.42 0,0.5 C-0.2,0.42 -0.33,0.26 -0.37,0.05 C-0.42,-0.2 -0.3,-0.42 0,-0.5 Z",
  // long and narrow, rounded at both ends - straplike muscles
  strap: "M0,-0.5 C0.24,-0.47 0.3,-0.32 0.28,-0.05 C0.3,0.22 0.26,0.4 0,0.5 C-0.26,0.4 -0.3,0.22 -0.28,-0.05 C-0.3,-0.32 -0.24,-0.47 0,-0.5 Z",
  // rounded all over, slightly irregular - caps, deltoids, small deep muscles
  round: "M0,-0.5 C0.32,-0.46 0.5,-0.24 0.46,0.02 C0.5,0.26 0.3,0.46 0,0.5 C-0.28,0.47 -0.5,0.24 -0.47,-0.03 C-0.5,-0.27 -0.3,-0.46 0,-0.5 Z",
  // broad diamond/kite - trapezius
  kite: "M0,-0.5 C0.2,-0.28 0.42,-0.1 0.4,0.08 C0.28,0.3 0.12,0.42 0,0.5 C-0.12,0.42 -0.28,0.3 -0.4,0.08 C-0.42,-0.1 -0.2,-0.28 0,-0.5 Z",
  // wide fan tapering to one point - pecs, lats
  fan: "M0,-0.5 C0.34,-0.44 0.5,-0.18 0.44,0.12 C0.34,0.34 0.14,0.44 0,0.5 C-0.16,0.44 -0.36,0.34 -0.45,0.1 C-0.5,-0.2 -0.32,-0.44 0,-0.5 Z",
};

function Muscle({ m, isActive, onSelect }) {
  const shape = SHAPES[m.shape] || SHAPES.spindle;
  return (
    <g onClick={() => onSelect(m.region)} className="muscle-shape" style={{ cursor: "pointer" }}>
      <path
        d={shape}
        transform={`translate(${m.cx} ${m.cy}) rotate(${m.angle || 0}) scale(${m.width} ${m.length})`}
        fill={isActive ? "var(--clay-bright)" : "var(--clay)"}
        fillOpacity={isActive ? 0.95 : 0.68}
        stroke={isActive ? "var(--clay-bright)" : "var(--clay)"}
        strokeOpacity={0.9}
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
      <title>{m.label}</title>
    </g>
  );
}

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
      {back && (
        <line x1="100" y1="90" x2="100" y2="218" stroke={SKIN_LINE} strokeWidth="1" strokeDasharray="3,4" fill="none" />
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

  return (
    <svg viewBox="0 0 200 500" style={{ width: "100%", maxWidth: 300, height: "auto" }}>
      {view === "side" ? <ProfileOutline /> : <StandingOutline back={view === "back"} />}
      {muscles.map((m, i) => (
        <Muscle key={`${m.region}-${i}`} m={m} isActive={m.region === activeRegion} onSelect={onSelect} />
      ))}
    </svg>
  );
}
