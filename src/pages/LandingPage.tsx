import React from "react";
import { Sparkles, Play, ArrowRight, ShieldCheck, Trophy, Terminal, Award } from "lucide-react";

interface LandingPageProps {
  onStart: (tab: string) => void;
  onExploreCompanies: () => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExploreCompanies, onLoginClick }) => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Landing Navigation Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: "800", fontSize: "1.35rem", background: "linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "10px", background: "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(157,77,255,0.22))", display: "grid", placeItems: "center", boxShadow: "0 10px 24px rgba(0,229,255,0.18)" }}>
            <Sparkles size={16} color="var(--primary-neon)" />
          </div>
          <span>PREP.AI</span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <a onClick={() => onStart("dashboard")} style={{ color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.95rem", textDecoration: "none" }} className="hover:text-white">Practice</a>
          <a onClick={onExploreCompanies} style={{ color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.95rem", textDecoration: "none" }}>Companies</a>
          <a onClick={() => onStart("resources")} style={{ color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.95rem", textDecoration: "none" }}>Resources</a>
          <button onClick={onLoginClick} className="glass-button">Sign In</button>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "80px 0" }}>
        <div className="glass-panel" style={{ padding: "8px 16px", borderRadius: "30px", marginBottom: "24px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", background: "rgba(0, 229, 255, 0.05)", borderColor: "rgba(0, 229, 255, 0.2)" }}>
          <Award size={14} color="var(--primary-neon)" />
          <span style={{ color: "var(--primary-neon)", fontWeight: "600", letterSpacing: "0.05em" }}>NEXT-GEN PLACEMENT PREPARATION</span>
        </div>

        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "900", lineHeight: "1.1", marginBottom: "24px", maxWidth: "900px" }}>
          Prepare Like You&apos;re <span className="gradient-text">Already Hired.</span>
        </h1>

        <p style={{ color: "var(--text-secondary)", fontSize: "clamp(1rem, 2vw, 1.25rem)", maxWidth: "700px", lineHeight: "1.6", marginBottom: "40px" }}>
          Practice exactly like real company hiring rounds with AI-powered voice interviews, company-specific aptitude tests, debugging challenges, and personalized growth roadmaps.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "60px" }}>
          <button onClick={() => onStart("interview")} className="glass-button primary" style={{ padding: "14px 28px", fontSize: "1rem" }}>
            <span>Start AI Interview</span>
            <Play size={16} fill="#03030b" />
          </button>
          <button onClick={() => onStart("crt")} className="glass-button" style={{ padding: "14px 28px", fontSize: "1rem" }}>
            <span>Explore Practice</span>
            <ArrowRight size={16} />
          </button>
          <button onClick={onExploreCompanies} className="glass-button" style={{ padding: "14px 28px", fontSize: "1rem", borderColor: "rgba(255,255,255,0.1)" }}>
            <span>Explore Companies</span>
          </button>
        </div>

        {/* Floating Glass Stats Grid */}
        <div className="display-grid grid-cols-3" style={{ width: "100%", maxWidth: "900px" }}>
          <div className="glass-panel" style={{ padding: "24px", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(0, 229, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-neon)" }}>
              <Terminal size={18} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Interactive Coding</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              Compile programs in C, C++, Python, Java, JS, or SQL. Get instantaneous compilation outputs and detailed AI complexity feedback.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "24px", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(189, 0, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary-neon)" }}>
              <ShieldCheck size={18} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>AI Resume Evaluation</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              Upload your resume to calculate a custom ATS rating. Reveal weaknesses and copy suggested revisions instantly.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "24px", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255, 0, 127, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-pink)" }}>
              <Trophy size={18} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Company-Specific Kits</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              Review hiring processes, patterns, topics, and salaries for 25+ top employers like Amazon, Google, Deloitte, and TCS.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "40px 0", borderTop: "1px solid rgba(255, 255, 255, 0.05)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
        <p>© 2026 PREP.AI Platform. Engineered for placement excellence.</p>
      </footer>
    </div>
  );
};
