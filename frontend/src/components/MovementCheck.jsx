import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { getRomTests, assessRom } from "../api";
import ExerciseList from "./ExerciseList";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

function getToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function angleAt(vertex, a, b) {
  const v1 = { x: a.x - vertex.x, y: a.y - vertex.y };
  const v2 = { x: b.x - vertex.x, y: b.y - vertex.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (mag1 === 0 || mag2 === 0) return null;
  const cos = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

export default function MovementCheck() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [side, setSide] = useState("left");
  const [source, setSource] = useState(null); // "webcam" | "file"
  const [running, setRunning] = useState(false);
  const [peakAngle, setPeakAngle] = useState(null);
  const [liveAngle, setLiveAngle] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const peakRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    getRomTests().then((res) => {
      setTests(res);
      setSelectedTest(res[0]);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
        const landmarker = await PoseLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: "VIDEO",
          numPoses: 1,
        });
        if (!cancelled) {
          landmarkerRef.current = landmarker;
          setModelReady(true);
        }
      } catch (e) {
        setError("Couldn't load the pose model - check your internet connection. (" + e.message + ")");
      }
    }
    init();
    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
    };
  }, []);

  function stopEverything() {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  useEffect(() => stopEverything, []);

  async function startWebcam() {
    resetTrial();
    setSource("webcam");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setRunning(true);
      loop();
    } catch (e) {
      setError("Couldn't access the webcam: " + e.message);
    }
  }

  function loadFile(file) {
    resetTrial();
    setSource("file");
    const url = URL.createObjectURL(file);
    videoRef.current.srcObject = null;
    videoRef.current.src = url;
    videoRef.current.onloadeddata = async () => {
      await videoRef.current.play();
      setRunning(true);
      loop();
    };
  }

  function resetTrial() {
    peakRef.current = null;
    setPeakAngle(null);
    setLiveAngle(null);
    setAssessment(null);
    setError(null);
  }

  function loop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !landmarkerRef.current) return;
    if (video.paused || video.ended) {
      setRunning(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const result = landmarkerRef.current.detectForVideo(video, performance.now());
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const lm = result.landmarks?.[0];
    if (lm && selectedTest) {
      const idx = side === "left" ? 0 : 1;
      const { joint, landmarks } = selectedTest;
      const vertexIdx = landmarks[joint.vertex][idx];
      const aIdx = landmarks[joint.a][idx];
      const bIdx = landmarks[joint.b][idx];
      const vertex = toPixel(lm[vertexIdx], canvas);
      const a = toPixel(lm[aIdx], canvas);
      const b = toPixel(lm[bIdx], canvas);
      const angle = angleAt(vertex, a, b);

      drawSkeleton(ctx, lm, canvas);
      drawAngleMarkers(ctx, [vertex, a, b]);

      if (angle != null) {
        setLiveAngle(angle);
        const usesMax = selectedTest.limited_below_deg !== null && selectedTest.limited_below_deg !== undefined;
        if (peakRef.current == null) {
          peakRef.current = angle;
        } else if (usesMax) {
          peakRef.current = Math.max(peakRef.current, angle);
        } else {
          peakRef.current = Math.min(peakRef.current, angle);
        }
        setPeakAngle(peakRef.current);
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  }

  function toPixel(landmark, canvas) {
    return { x: landmark.x * canvas.width, y: landmark.y * canvas.height };
  }

  function drawSkeleton(ctx, lm, canvas) {
    ctx.fillStyle = getToken("--md-sys-color-tertiary");
    for (const point of lm) {
      ctx.beginPath();
      ctx.arc(point.x * canvas.width, point.y * canvas.height, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function drawAngleMarkers(ctx, points) {
    ctx.strokeStyle = getToken("--md-sys-color-primary");
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[1].x, points[1].y);
    ctx.lineTo(points[0].x, points[0].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.stroke();
  }

  async function finishTrial() {
    stopEverything();
    if (peakRef.current == null || !selectedTest) return;
    try {
      const res = await assessRom(selectedTest.id, peakRef.current);
      setAssessment(res);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h2 className="section-heading md-headline-small">Check your range of motion</h2>
      <p className="md-body-medium" style={{ color: "var(--md-sys-color-on-surface-variant)", marginBottom: "1rem" }}>
        Pose tracking runs entirely in your browser - your video is never uploaded or stored anywhere. This is a rough
        screening estimate, not a clinical measurement or diagnosis.
      </p>

      <div className="m3-card m3-card-filled" style={{ padding: "1.2rem", marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end" }}>
        <div className="m3-field" style={{ minWidth: 200 }}>
          <label htmlFor="rom-test-select">Movement test</label>
          <select
            id="rom-test-select"
            value={selectedTest?.id || ""}
            onChange={(e) => {
              setSelectedTest(tests.find((t) => t.id === e.target.value));
              resetTrial();
            }}
          >
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="md-label-medium" style={{ display: "block", color: "var(--md-sys-color-on-surface-variant)", marginBottom: "6px" }}>Side</label>
          <div className="m3-segmented">
            <button className={`m3-segment ${side === "left" ? "is-selected" : ""}`} onClick={() => setSide("left")}>
              {side === "left" ? "✓ " : ""}Left
            </button>
            <button className={`m3-segment ${side === "right" ? "is-selected" : ""}`} onClick={() => setSide("right")}>
              {side === "right" ? "✓ " : ""}Right
            </button>
          </div>
        </div>
        <button className="m3-button m3-button-filled md-label-large" onClick={startWebcam} disabled={!modelReady}>
          Use webcam
        </button>
        <label className="m3-button m3-button-outlined md-label-large" style={{ display: "inline-flex" }}>
          Upload a video
          <input type="file" accept="video/*" hidden onChange={(e) => e.target.files[0] && loadFile(e.target.files[0])} />
        </label>
        {running && (
          <button className="m3-button m3-button-tonal md-label-large" onClick={finishTrial}>
            Capture peak &amp; assess
          </button>
        )}
      </div>

      {selectedTest && (
        <p className="m3-chip md-label-large" style={{ marginBottom: "1rem", display: "inline-flex", height: "auto", padding: "10px 16px" }}>
          {selectedTest.instruction}
        </p>
      )}

      {!modelReady && !error && <p className="empty-state md-body-medium">Loading pose model...</p>}
      {error && <p className="caution md-body-small" style={{ display: "inline-block", marginBottom: "1rem" }}>{error}</p>}

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 480, maxWidth: "100%" }}>
          <video ref={videoRef} muted playsInline style={{ display: "none" }} />
          <canvas ref={canvasRef} style={{ width: "100%", borderRadius: "var(--md-sys-shape-corner-medium)", background: "var(--md-sys-color-surface-container-high)" }} />
          {liveAngle != null && (
            <div
              className="md-label-large"
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "var(--md-sys-color-inverse-surface)",
                color: "var(--md-sys-color-inverse-on-surface)",
                padding: "6px 12px",
                borderRadius: "var(--md-sys-shape-corner-small)",
              }}
            >
              live: {liveAngle.toFixed(0)}° &nbsp;|&nbsp; peak: {peakAngle?.toFixed(0)}°
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          {assessment ? (
            <>
              <h3 className="md-title-large" style={{ marginBottom: "0.5rem" }}>{assessment.headline}</h3>
              <p className="md-body-medium" style={{ color: "var(--md-sys-color-on-surface-variant)", marginBottom: "1rem" }}>{assessment.suggestion}</p>
              <ExerciseList exercises={assessment.exercises} />
            </>
          ) : (
            <p className="empty-state md-body-medium">
              Follow the instruction above, then click "Capture peak &amp; assess" at the top of the movement.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
