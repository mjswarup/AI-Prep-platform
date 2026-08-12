import React, { useState } from "react";
import { Upload, FileText, AlertTriangle, Sparkles, Copy, Download, RefreshCw } from "lucide-react";

export const ResumeAnalyzer: React.FC = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileName(e.dataTransfer.files[0].name);
      setFileUploaded(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setFileUploaded(true);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  const resetAnalyzer = () => {
    setFileUploaded(false);
    setFileName("");
    setAnalysisComplete(false);
  };

  // Mock parsed results
  const parsedData = {
    atsScore: 74,
    skills: ["React", "JavaScript (ES6)", "HTML/CSS", "Python", "SQL", "Git"],
    projects: [
      "E-Commerce website using Django",
      "Task Manager SPA with React"
    ],
    weaknesses: [
      "Missing quantitative metrics in project descriptions (e.g., speedups, user counts, load times).",
      "No Cloud/DevOps tools (AWS, Docker, GCP) mentioned in the skills section.",
      "Lack of strong action verbs at the beginning of bullet points (e.g., using 'Worked on' instead of 'Optimized')."
    ],
    improvements: [
      {
        original: "Worked on building frontend features using React for a task management app.",
        improved: "Designed and engineered 10+ responsive React frontend components, improving load latency by 35%."
      },
      {
        original: "Responsible for writing backend databases and SQL queries.",
        improved: "Optimized complex SQL query structures and indexed databases, reducing query retrieval latency by 42%."
      },
      {
        original: "Created a Django project for e-commerce.",
        improved: "Deployed a Django-based e-commerce platform supporting 500+ concurrent user interactions and secure stripe payments."
      }
    ]
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>AI Resume Analyzer</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          Scan your resume against ATS databases, extract core skills, and get metrics-based writing improvements.
        </p>
      </div>

      {!fileUploaded && !analysisComplete && (
        /* Step 1: Upload Box */
        <div 
          className="glass-panel"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ 
            padding: "60px 40px", 
            textAlign: "center", 
            borderStyle: "dashed", 
            borderColor: "rgba(0, 229, 255, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer"
          }}
          onClick={() => document.getElementById("resume-input")?.click()}
        >
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(0,229,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-neon)" }}>
            <Upload size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Drag & Drop Resume</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>Supports PDF, DOCX formats (Max 5MB)</p>
          </div>
          <button className="glass-button">Browse Files</button>
          <input 
            type="file" 
            id="resume-input" 
            onChange={handleFileSelect} 
            accept=".pdf,.docx" 
            style={{ display: "none" }} 
          />
        </div>
      )}

      {fileUploaded && !analysisComplete && (
        /* Step 2: Selected File & Loading screen */
        <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
            <FileText size={32} color="var(--primary-neon)" />
            <div style={{ textAlign: "left" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "700" }}>{fileName}</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Ready for AI Analysis</p>
            </div>
          </div>

          {isAnalyzing ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div className="loader-spinner" style={{ width: "32px", height: "32px" }} />
              <p style={{ fontSize: "0.85rem", color: "var(--primary-neon)", fontWeight: "600", letterSpacing: "0.05em" }}>
                AI EXTRACTING SKILLS & CALCULATING ATS SCORE...
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={resetAnalyzer} className="glass-button">Cancel</button>
              <button onClick={startAnalysis} className="glass-button primary">Analyze Resume</button>
            </div>
          )}
        </div>
      )}

      {analysisComplete && (
        /* Step 3: Analysis Results Reports */
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          <div className="display-grid grid-cols-3" style={{ gridTemplateColumns: "1.2fr 2fr" }}>
            
            {/* Left: ATS score gauge & parsed details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* ATS score */}
              <div className="glass-panel" style={{ padding: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "bold" }}>ATS MATCH SCORE</span>
                
                <div style={{ position: "relative", width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="none" 
                      stroke="var(--primary-neon)" 
                      strokeWidth="8" 
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - parsedData.atsScore / 100)}`}
                      strokeLinecap="round"
                      style={{ 
                        transform: "rotate(-90deg)", 
                        transformOrigin: "50% 50%",
                        transition: "stroke-dashoffset 1s ease" 
                      }}
                    />
                  </svg>
                  <span style={{ position: "absolute", fontSize: "1.8rem", fontWeight: "900", color: "var(--primary-neon)" }}>{parsedData.atsScore}%</span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Your resume is highly optimized, but missing essential metrics. Target 85%+ score.
                </p>
                <button onClick={resetAnalyzer} className="glass-button" style={{ fontSize: "0.75rem", padding: "6px 14px", marginTop: "4px" }}>
                  <RefreshCw size={12} /> Scan New Resume
                </button>
              </div>

              {/* Parsed Skills */}
              <div className="glass-panel" style={{ padding: "20px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "bold", marginBottom: "12px" }}>Identified Skills</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {parsedData.skills.map((s) => (
                    <span key={s} style={{ fontSize: "0.75rem", padding: "3px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)" }}>{s}</span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Weaknesses & Improvements */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Weaknesses detected */}
              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={18} color="var(--accent-pink)" />
                  <span>Weak Areas Identified</span>
                </h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {parsedData.weaknesses.map((w) => (
                    <div key={w} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-pink)", marginTop: "6px", flexShrink: 0 }} />
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>{w}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side by side original vs improved bullet points */}
              <div className="glass-panel" style={{ padding: "24px" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <Sparkles size={18} color="var(--primary-neon)" />
                  <span>AI Suggestions & Copy Revisions</span>
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {parsedData.improvements.map((item, idx) => (
                    <div 
                      key={item.original}
                      style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "10px", 
                        borderBottom: idx === parsedData.improvements.length - 1 ? "none" : "1px solid rgba(255,255,255,0.06)",
                        paddingBottom: idx === parsedData.improvements.length - 1 ? "0" : "16px"
                      }}
                    >
                      {/* Original Bullet */}
                      <div style={{ padding: "8px 12px", borderRadius: "6px", background: "rgba(255, 0, 127, 0.02)", borderLeft: "3px solid var(--accent-pink)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        <span style={{ fontWeight: "bold", fontSize: "0.7rem", color: "var(--accent-pink)", display: "block", marginBottom: "2px" }}>ORIGINAL</span>
                        <span>&quot;{item.original}&quot;</span>
                      </div>

                      {/* Improved Bullet */}
                      <div 
                        style={{ 
                          padding: "10px 14px", 
                          borderRadius: "6px", 
                          background: "rgba(0, 229, 255, 0.03)", 
                          borderLeft: "3px solid var(--primary-neon)", 
                          fontSize: "0.85rem", 
                          color: "var(--text-primary)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px"
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: "bold", fontSize: "0.7rem", color: "var(--primary-neon)", display: "block", marginBottom: "2px" }}>AI IMPROVED OPTIMIZATION</span>
                          <span>&quot;{item.improved}&quot;</span>
                        </div>
                        
                        {/* Copy button */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.improved);
                            alert("Copied to clipboard!");
                          }}
                          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "4px" }}
                          onMouseOver={(e) => e.currentTarget.style.color = "var(--primary-neon)"}
                          onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                          title="Copy revision"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Download Improved Resume CTA */}
          <div className="glass-panel" style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Export Optimized Resume Version</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>Includes all AI-optimized points and ATS formatting templates.</p>
            </div>
            
            <button 
              onClick={() => alert("Downloading mock ATS-friendly resume layout...")}
              className="glass-button primary" 
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Download size={16} fill="#03030b" />
              <span>Download Improved PDF</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
