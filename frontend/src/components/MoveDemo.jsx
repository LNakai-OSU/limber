const SIZE = { width: 96, height: 116 };

function ForwardFold() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="10" y1="112" x2="90" y2="112" />
      <g className="anim-bendHips" style={{ transformOrigin: "50px 70px" }}>
        <circle className="demo-joint" cx="50" cy="18" r="8" />
        <line className="demo-line" x1="50" y1="26" x2="50" y2="70" />
        <line className="demo-line" x1="50" y1="34" x2="30" y2="55" />
        <line className="demo-accent" x1="50" y1="34" x2="70" y2="55" />
      </g>
      <line className="demo-line" x1="50" y1="70" x2="42" y2="112" />
      <line className="demo-line" x1="50" y1="70" x2="58" y2="112" />
    </svg>
  );
}

function OverheadReach() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="10" y1="112" x2="90" y2="112" />
      <circle className="demo-joint" cx="50" cy="18" r="8" />
      <line className="demo-line" x1="50" y1="26" x2="50" y2="72" />
      <line className="demo-line" x1="50" y1="72" x2="40" y2="112" />
      <line className="demo-line" x1="50" y1="72" x2="60" y2="112" />
      <line className="demo-accent" x1="50" y1="34" x2="34" y2="52" />
      <g className="anim-armOverhead" style={{ transformOrigin: "50px 34px" }}>
        <line className="demo-accent" x1="50" y1="34" x2="66" y2="70" />
      </g>
    </svg>
  );
}

function CrossBodyPull() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="10" y1="112" x2="90" y2="112" />
      <circle className="demo-joint" cx="50" cy="18" r="8" />
      <line className="demo-line" x1="50" y1="26" x2="50" y2="72" />
      <line className="demo-line" x1="50" y1="72" x2="40" y2="112" />
      <line className="demo-line" x1="50" y1="72" x2="60" y2="112" />
      <line className="demo-line" x1="50" y1="34" x2="70" y2="50" />
      <g className="anim-armAcrossChest" style={{ transformOrigin: "50px 34px" }}>
        <line className="demo-accent" x1="50" y1="34" x2="34" y2="30" />
      </g>
    </svg>
  );
}

function SeatedTwist() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="15" y1="105" x2="85" y2="105" />
      <line className="demo-line" x1="35" y1="105" x2="50" y2="80" />
      <line className="demo-line" x1="65" y1="105" x2="50" y2="80" />
      <g className="anim-trunkTwist" style={{ transformOrigin: "50px 80px" }}>
        <line className="demo-line" x1="50" y1="80" x2="50" y2="34" />
        <circle className="demo-joint" cx="50" cy="24" r="8" />
        <line className="demo-accent" x1="35" y1="45" x2="65" y2="40" />
      </g>
    </svg>
  );
}

function KneelingLunge() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="10" y1="112" x2="90" y2="112" />
      <g className="anim-kneelShift" style={{ transformOrigin: "60px 90px" }}>
        <circle className="demo-joint" cx="60" cy="30" r="8" />
        <line className="demo-line" x1="60" y1="38" x2="55" y2="80" />
        <line className="demo-line" x1="55" y1="80" x2="70" y2="112" />
        <line className="demo-accent" x1="55" y1="80" x2="30" y2="112" />
        <line className="demo-accent" x1="30" y1="112" x2="20" y2="112" />
      </g>
      <line className="demo-line" x1="70" y1="112" x2="82" y2="112" />
    </svg>
  );
}

function QuadrupedFlow() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="10" y1="105" x2="90" y2="105" />
      <line className="demo-line" x1="30" y1="105" x2="30" y2="80" />
      <line className="demo-line" x1="70" y1="105" x2="70" y2="80" />
      <line className="demo-line" x1="30" y1="105" x2="24" y2="95" />
      <line className="demo-line" x1="70" y1="105" x2="76" y2="95" />
      <g className="anim-spineArch">
        <line className="demo-accent" x1="30" y1="80" x2="70" y2="80" />
        <circle className="demo-joint" cx="76" cy="76" r="7" />
      </g>
    </svg>
  );
}

function SupineKneePull() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="10" y1="105" x2="90" y2="105" />
      <line className="demo-line" x1="18" y1="95" x2="55" y2="95" />
      <circle className="demo-joint" cx="14" cy="93" r="8" />
      <line className="demo-line" x1="80" y1="105" x2="65" y2="80" />
      <g className="anim-kneeToChest" style={{ transformOrigin: "55px 95px" }}>
        <line className="demo-accent" x1="55" y1="95" x2="55" y2="60" />
        <line className="demo-accent" x1="55" y1="60" x2="30" y2="60" />
      </g>
    </svg>
  );
}

function SideLyingRaise() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="10" y1="95" x2="90" y2="95" />
      <circle className="demo-joint" cx="18" cy="85" r="8" />
      <line className="demo-line" x1="26" y1="88" x2="60" y2="88" />
      <line className="demo-line" x1="60" y1="88" x2="80" y2="88" />
      <g className="anim-legRaiseSide" style={{ transformOrigin: "60px 88px" }}>
        <line className="demo-accent" x1="60" y1="88" x2="88" y2="72" />
      </g>
    </svg>
  );
}

function CalfAnkleFlex() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-floor" x1="10" y1="112" x2="90" y2="112" />
      <circle className="demo-joint" cx="50" cy="20" r="8" />
      <line className="demo-line" x1="50" y1="28" x2="50" y2="70" />
      <line className="demo-line" x1="50" y1="70" x2="50" y2="102" />
      <g className="anim-ankleFlex" style={{ transformOrigin: "50px 102px" }}>
        <line className="demo-accent" x1="50" y1="102" x2="72" y2="106" />
      </g>
    </svg>
  );
}

function WristForearmFlex() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-line" x1="14" y1="60" x2="60" y2="60" />
      <circle className="demo-joint" cx="10" cy="60" r="6" />
      <g className="anim-wristFlex" style={{ transformOrigin: "60px 60px" }}>
        <line className="demo-accent" x1="60" y1="60" x2="86" y2="52" />
      </g>
      <line className="demo-floor" x1="5" y1="80" x2="95" y2="80" />
    </svg>
  );
}

function JawOpen() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <circle className="demo-line" cx="50" cy="45" r="26" fill="none" />
      <g className="anim-jawOpen" style={{ transformOrigin: "50px 55px" }}>
        <path className="demo-accent" d="M32,58 Q50,72 68,58" />
      </g>
    </svg>
  );
}

function NeckTilt() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-line" x1="50" y1="40" x2="42" y2="90" />
      <line className="demo-line" x1="50" y1="40" x2="58" y2="90" />
      <g className="anim-neckTilt" style={{ transformOrigin: "50px 36px" }}>
        <circle className="demo-joint" cx="50" cy="20" r="10" />
      </g>
      <line className="demo-floor" x1="15" y1="100" x2="85" y2="100" />
    </svg>
  );
}

function RollPulse() {
  return (
    <svg viewBox="0 0 100 120" {...SIZE}>
      <line className="demo-line" x1="20" y1="80" x2="80" y2="80" />
      <g className="anim-rollSlide">
        <circle className="demo-joint" cx="50" cy="65" r="12" />
      </g>
      <line className="demo-floor" x1="10" y1="95" x2="90" y2="95" />
    </svg>
  );
}

const ARCHETYPES = {
  "forward-fold": ForwardFold,
  "overhead-reach": OverheadReach,
  "cross-body-pull": CrossBodyPull,
  "seated-twist": SeatedTwist,
  "kneeling-lunge": KneelingLunge,
  "quadruped-flow": QuadrupedFlow,
  "supine-knee-pull": SupineKneePull,
  "side-lying-raise": SideLyingRaise,
  "calf-ankle-flex": CalfAnkleFlex,
  "wrist-forearm-flex": WristForearmFlex,
  "jaw-open": JawOpen,
  "roll-pulse": RollPulse,
  "neck-tilt": NeckTilt,
};

export default function MoveDemo({ archetype }) {
  const Component = ARCHETYPES[archetype];
  if (!Component) return null;
  return (
    <div className="demo-frame">
      <Component />
    </div>
  );
}
