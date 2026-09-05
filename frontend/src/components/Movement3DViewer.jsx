import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Joint-rotation targets per archetype - degrees, applied as a sinusoidal
// oscillation between "from" and "to" on the named joint's local axis. The
// rig is a real forward-kinematics hierarchy (see buildRig), so rotating a
// parent joint (e.g. a shoulder) carries every child bone with it, same as
// an actual skeleton - this is what makes it "real 3D", not a flipbook.
const ARCHETYPES = {
  "forward-fold": [{ joint: "hip", axis: "x", from: 0, to: 48 }],
  "overhead-reach": [{ joint: "shoulderR", axis: "x", from: 5, to: 175 }],
  "cross-body-pull": [{ joint: "shoulderR", axis: "z", from: 0, to: -75 }],
  "seated-twist": [{ joint: "chest", axis: "y", from: -28, to: 28 }],
  "kneeling-lunge": [
    { joint: "thighR", axis: "x", from: 0, to: -50 },
    { joint: "kneeL", axis: "x", from: 0, to: 95 },
  ],
  "quadruped-flow": [
    { joint: "hip", axis: "x", from: 85, to: 85 },
    { joint: "spine", axis: "x", from: -18, to: 18 },
  ],
  "supine-knee-pull": [
    { joint: "thighR", axis: "x", from: 0, to: -105 },
    { joint: "kneeR", axis: "x", from: 5, to: 120 },
  ],
  "side-lying-raise": [{ joint: "thighR", axis: "z", from: 0, to: -38 }],
  "calf-ankle-flex": [{ joint: "ankleR", axis: "x", from: -12, to: 22 }],
  "wrist-forearm-flex": [{ joint: "wristR", axis: "x", from: -42, to: 42 }],
  "jaw-open": [{ joint: "head", axis: "x", from: 0, to: 22 }],
  "neck-tilt": [{ joint: "neck", axis: "z", from: -30, to: 30 }],
  "roll-pulse": [{ joint: "wristR", axis: "x", from: -8, to: 8 }],
};

const BONE_COLOR = 0x276a49; // --md-sys-color-primary
const JOINT_COLOR = 0x3c6471; // --md-sys-color-tertiary

// dir: +1 grows the bone upward (+Y) from its joint, -1 grows it downward.
// Every chain below (spine going up; arms/legs going down) needs this to
// stay attached to its parent instead of drawing back through it.
function bone(length, radius, dir = -1) {
  const geo = new THREE.CapsuleGeometry(radius, Math.max(length - radius * 2, 0.02), 4, 8);
  const mat = new THREE.MeshStandardMaterial({ color: BONE_COLOR, roughness: 0.6, metalness: 0.05 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = (dir * length) / 2;
  return mesh;
}

function jointSphere(radius) {
  const geo = new THREE.SphereGeometry(radius, 16, 16);
  const mat = new THREE.MeshStandardMaterial({ color: JOINT_COLOR, roughness: 0.5 });
  return new THREE.Mesh(geo, mat);
}

// Builds a jointed rig: each named joint is a THREE.Group positioned at its
// parent's attachment point, holding a joint sphere plus a bone extending
// toward its child. Rotating a group rotates everything attached below it.
function buildRig() {
  const root = new THREE.Group();
  const joints = {};

  const add = (name, parent, position, boneLength, boneRadius, jointRadius, dir = -1) => {
    const g = new THREE.Group();
    g.position.set(...position);
    if (jointRadius) g.add(jointSphere(jointRadius));
    if (boneLength) {
      g.add(bone(boneLength, boneRadius, dir));
    }
    parent.add(g);
    joints[name] = g;
    return g;
  };

  const hip = add("hip", root, [0, 1.02, 0], 0, 0, 0.1);
  const spine = add("spine", hip, [0, 0, 0], 0.42, 0.09, 0.08, 1);
  const chest = add("chest", spine, [0, 0.42, 0], 0, 0, 0.12);
  const neck = add("neck", chest, [0, 0, 0], 0.12, 0.05, 0.05, 1);
  const head = add("head", neck, [0, 0.12, 0], 0.22, 0.12, 0, 1);
  const nose = jointSphere(0.035);
  nose.position.set(0, 0.24, 0.13);
  head.add(nose);

  const shoulderR = add("shoulderR", chest, [-0.24, -0.04, 0], 0.32, 0.06, 0.07);
  const elbowR = add("elbowR", shoulderR, [0, -0.32, 0], 0.28, 0.05, 0.055);
  const wristR = add("wristR", elbowR, [0, -0.28, 0], 0.16, 0.04, 0.045);
  add("handR", wristR, [0, -0.16, 0], 0, 0, 0.05);

  const shoulderL = add("shoulderL", chest, [0.24, -0.04, 0], 0.32, 0.06, 0.07);
  const elbowL = add("elbowL", shoulderL, [0, -0.32, 0], 0.28, 0.05, 0.055);
  const wristL = add("wristL", elbowL, [0, -0.28, 0], 0.16, 0.04, 0.045);
  add("handL", wristL, [0, -0.16, 0], 0, 0, 0.05);

  const thighR = add("thighR", hip, [-0.12, 0, 0], 0.44, 0.09, 0.09);
  const kneeR = add("kneeR", thighR, [0, -0.44, 0], 0.42, 0.07, 0.07);
  const ankleR = add("ankleR", kneeR, [0, -0.42, 0], 0.1, 0.05, 0.055);
  add("footR", ankleR, [0, -0.06, 0.09], 0, 0, 0.06);

  const thighL = add("thighL", hip, [0.12, 0, 0], 0.44, 0.09, 0.09);
  const kneeL = add("kneeL", thighL, [0, -0.44, 0], 0.42, 0.07, 0.07);
  const ankleL = add("ankleL", kneeL, [0, -0.42, 0], 0.1, 0.05, 0.055);
  add("footL", ankleL, [0, -0.06, 0.09], 0, 0, 0.06);

  shoulderR.rotation.z = -0.08;
  shoulderL.rotation.z = 0.08;

  return { root, joints };
}

export default function Movement3DViewer({ archetype, onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 20);
    camera.position.set(1.6, 1.4, 2.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.9, 0);
    controls.enablePan = false;
    controls.minDistance = 1.3;
    controls.maxDistance = 4;
    controls.update();

    scene.add(new THREE.HemisphereLight(0xf6fbf4, 0x276a49, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(2, 3, 2);
    scene.add(dir);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.1, 40),
      new THREE.MeshStandardMaterial({ color: 0xdce5dc, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const { root, joints } = buildRig();
    scene.add(root);

    const steps = ARCHETYPES[archetype] || [];

    let raf;
    const startTime = performance.now();
    function animate() {
      raf = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;
      const t = (Math.sin(elapsed * 1.4) + 1) / 2;
      for (const step of steps) {
        const g = joints[step.joint];
        if (!g) continue;
        const deg = step.from + (step.to - step.from) * t;
        const rad = THREE.MathUtils.degToRad(deg);
        if (step.axis === "x") g.rotation.x = rad;
        if (step.axis === "y") g.rotation.y = rad;
        if (step.axis === "z") g.rotation.z = rad;
      }
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [archetype]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "color-mix(in srgb, var(--md-sys-color-scrim) 32%, transparent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        className="m3-card"
        style={{
          padding: "1.4rem",
          width: "min(420px, 90vw)",
          background: "var(--md-sys-color-surface-container-high)",
          borderRadius: "var(--md-sys-shape-corner-extra-large)",
          boxShadow: "var(--md-sys-elevation-3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
          <span className="md-body-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Drag to rotate, scroll to zoom</span>
          <button className="m3-button m3-button-text md-label-large" onClick={onClose} style={{ padding: "0 12px", height: 32 }}>
            Close
          </button>
        </div>
        <div ref={containerRef} style={{ width: "100%", height: 320, borderRadius: "var(--md-sys-shape-corner-medium)", overflow: "hidden", background: "var(--md-sys-color-surface-container-highest)" }} />
      </div>
    </div>
  );
}
