import { useState } from "react";
import DescribeTab from "./components/DescribeTab";
import AnatomyMap from "./components/AnatomyMap";
import MovementCheck from "./components/MovementCheck";

const TABS = [
  { id: "describe", label: "Describe It" },
  { id: "map", label: "Anatomy Map" },
  { id: "video", label: "Movement Check" },
];

export default function App() {
  const [tab, setTab] = useState("describe");

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="logo-mark">
          <svg width="22" height="22" viewBox="0 0 32 32">
            <path
              d="M9 20c3-8 6-11 10-11M13 9c3 3 4 8 2 14"
              stroke="#F2A45C"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <div>
          <h1>Limber</h1>
          <p className="tagline">Find exercises and stretches for pain, discomfort, or stiffness - three ways.</p>
        </div>
      </div>

      <div className="disclaimer">
        <strong>Not medical advice.</strong> Limber suggests general wellness stretches and mobility exercises based
        on common, well-established movements - it does not diagnose conditions or replace a doctor or physical
        therapist. If you have severe, worsening, or radiating pain, numbness, or a recent injury, please seek
        professional care instead.
      </div>

      <div className="tab-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`btn btn-secondary ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "describe" && <DescribeTab />}
      {tab === "map" && <AnatomyMap />}
      {tab === "video" && <MovementCheck />}
    </div>
  );
}
