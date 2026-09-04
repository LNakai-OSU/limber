// Small joint/region markers for areas the real wger.de muscle illustrations
// don't cover (wger only publishes 15 major muscle groups). Positioned using
// the actual bounding boxes of the real muscle art in realMuscles.js so they
// line up with the illustrated body rather than being guessed independently.

const p = (region, label, cx, cy, r) => ({ region, label, cx, cy, r });

export const FRONT_MARKERS = [
  p("jaw", "Jaw", 99, 42, 7),
  p("neck", "Neck", 99, 55, 9),
  p("forearms", "Forearm", 40, 165, 9),
  p("forearms", "Forearm", 158, 165, 9),
  p("wrists", "Wrist", 36, 202, 8),
  p("wrists", "Wrist", 162, 202, 8),
  p("elbows", "Elbow", 46, 133, 7),
  p("elbows", "Elbow", 152, 133, 7),
  p("hips", "Hip", 70, 172, 8),
  p("hips", "Hip", 128, 172, 8),
  p("adductors", "Adductors (inner thigh)", 86, 215, 9),
  p("adductors", "Adductors (inner thigh)", 112, 215, 9),
  p("it-band", "IT Band (outer thigh)", 58, 225, 7),
  p("it-band", "IT Band (outer thigh)", 140, 225, 7),
  p("knees", "Knee", 72, 258, 8),
  p("knees", "Knee", 128, 258, 8),
  p("shins", "Shin (tibialis anterior)", 74, 305, 8),
  p("shins", "Shin (tibialis anterior)", 126, 305, 8),
  p("ankles", "Ankle", 76, 358, 7),
  p("ankles", "Ankle", 124, 358, 7),
  p("feet", "Foot", 78, 378, 10),
  p("feet", "Foot", 122, 378, 10),
];

export const BACK_MARKERS = [
  p("neck", "Neck", 99, 55, 9),
  p("shoulders", "Posterior deltoid", 56, 80, 10),
  p("shoulders", "Posterior deltoid", 142, 80, 10),
  p("forearms", "Forearm", 40, 165, 9),
  p("forearms", "Forearm", 158, 165, 9),
  p("wrists", "Wrist", 36, 202, 8),
  p("wrists", "Wrist", 162, 202, 8),
  p("elbows", "Elbow", 46, 133, 7),
  p("elbows", "Elbow", 152, 133, 7),
  p("hips", "Hip", 70, 172, 8),
  p("hips", "Hip", 128, 172, 8),
  p("piriformis", "Piriformis (deep glute)", 78, 200, 7),
  p("piriformis", "Piriformis (deep glute)", 120, 200, 7),
  p("lower-back", "Lower back (erector spinae)", 99, 145, 10),
  p("it-band", "IT Band (outer thigh)", 58, 225, 7),
  p("it-band", "IT Band (outer thigh)", 140, 225, 7),
  p("knees", "Knee", 72, 258, 8),
  p("knees", "Knee", 128, 258, 8),
  p("ankles", "Ankle (Achilles)", 76, 358, 7),
  p("ankles", "Ankle (Achilles)", 124, 358, 7),
  p("feet", "Heel", 78, 378, 10),
  p("feet", "Heel", 122, 378, 10),
];

export const JOINT_MARKERS = { front: FRONT_MARKERS, back: BACK_MARKERS };
