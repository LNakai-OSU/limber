const BODY_FILL = "#c9dbd5";
const BODY_STROKE = "#9fbcb2";

function Limb({ x1, y1, x2, y2, width }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BODY_FILL} strokeWidth={width} strokeLinecap="round" />
  );
}

export default function BodySilhouette({ view, regions, activeRegion, onSelect }) {
  const hotspots = [];
  for (const region of regions) {
    const points = region.hotspots[view];
    if (!points) continue;
    for (const p of points) {
      hotspots.push({ ...p, id: region.id, label: region.label });
    }
  }

  return (
    <svg viewBox="0 0 200 500" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      {/* torso */}
      <path
        d="M63,88 Q100,78 137,88 L128,222 Q100,232 72,222 Z"
        fill={BODY_FILL}
        stroke={BODY_STROKE}
        strokeWidth="1.5"
      />
      {/* pelvis */}
      <path d="M72,220 L128,220 L120,240 L80,240 Z" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.5" />
      {/* head + neck */}
      <line x1="100" y1="58" x2="100" y2="75" stroke={BODY_FILL} strokeWidth="18" strokeLinecap="round" />
      <circle cx="100" cy="35" r="24" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.5" />
      {/* arms */}
      <Limb x1={62} y1={95} x2={42} y2={182} width={22} />
      <Limb x1={138} y1={95} x2={158} y2={182} width={22} />
      <Limb x1={42} y1={182} x2={30} y2={270} width={18} />
      <Limb x1={158} y1={182} x2={170} y2={270} width={18} />
      <circle cx="29" cy="277" r="11" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.5" />
      <circle cx="171" cy="277" r="11" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.5" />
      {/* legs */}
      <Limb x1={80} y1={236} x2={78} y2={345} width={28} />
      <Limb x1={120} y1={236} x2={122} y2={345} width={28} />
      <Limb x1={78} y1={345} x2={78} y2={452} width={20} />
      <Limb x1={122} y1={345} x2={122} y2={452} width={20} />
      <ellipse cx="80" cy="472" rx="16" ry="10" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.5" />
      <ellipse cx="120" cy="472" rx="16" ry="10" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.5" />

      {view === "front" ? (
        <>
          <circle cx="92" cy="32" r="2.4" fill={BODY_STROKE} />
          <circle cx="108" cy="32" r="2.4" fill={BODY_STROKE} />
        </>
      ) : (
        <line x1="100" y1="90" x2="100" y2="218" stroke={BODY_STROKE} strokeWidth="1" strokeDasharray="3,4" />
      )}

      {hotspots.map((h, i) => {
        const isActive = h.id === activeRegion;
        return (
          <g
            key={`${h.id}-${i}`}
            transform={`translate(${h.x}, ${h.y})`}
            onClick={() => onSelect(h.id)}
            style={{ cursor: "pointer" }}
          >
            <circle r={isActive ? 11 : 9} fill={isActive ? "#e08e45" : "#2f6f62"} opacity={isActive ? 1 : 0.85} stroke="#fff" strokeWidth="2" />
            <title>{h.label}</title>
          </g>
        );
      })}
    </svg>
  );
}
