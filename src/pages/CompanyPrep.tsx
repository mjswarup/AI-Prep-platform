import React, { useState } from "react";
import { companiesData, type Company } from "../mockData";
import { Building2, Search, ArrowRight, BookOpen, DollarSign, Calendar, ListChecks, Award } from "lucide-react";

interface CompanyPrepProps {
  onStartPractice: (tab: string) => void;
}

export const CompanyPrep: React.FC<CompanyPrepProps> = ({ onStartPractice }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(companiesData[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = companiesData.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Company Specific Preparation</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          Targeted study material, hiring patterns, and mock interviews for top-tier companies.
        </p>
      </div>

      <div className="display-grid grid-cols-3" style={{ gridTemplateColumns: "1fr 2.2fr" }}>
        {/* Left Side: Companies search & list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: "36px" }}
            />
          </div>

          <div 
            className="glass-panel" 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "6px", 
              maxHeight: "550px", 
              overflowY: "auto",
              padding: "10px"
            }}
          >
            {filteredCompanies.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCompany(c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: selectedCompany?.name === c.name ? "var(--primary-neon)" : "transparent",
                  background: selectedCompany?.name === c.name ? "rgba(0, 229, 255, 0.05)" : "transparent",
                  color: selectedCompany?.name === c.name ? "var(--primary-neon)" : "var(--text-primary)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div 
                    style={{ 
                      width: "36px", 
                      height: "36px", 
                      borderRadius: "8px", 
                      background: selectedCompany?.name === c.name ? "linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))" : "rgba(255,255,255,0.04)",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: selectedCompany?.name === c.name ? "#03030b" : "var(--text-primary)",
                      fontWeight: "bold",
                      fontSize: "1.1rem"
                    }}
                  >
                    {c.logo}
                  </div>
                  <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>{c.name}</span>
                </div>
                <ArrowRight size={14} style={{ opacity: selectedCompany?.name === c.name ? 1 : 0.2 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Detailed company overview */}
        {selectedCompany ? (
          <div className="glass-panel" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Header info */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div 
                  style={{ 
                    width: "56px", 
                    height: "56px", 
                    borderRadius: "12px", 
                    background: "linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: "#03030b",
                    fontWeight: "900",
                    fontSize: "1.8rem"
                  }}
                >
                  {selectedCompany.logo}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: "900" }}>{selectedCompany.name} Preparation</h3>
                  <p style={{ color: "var(--primary-neon)", fontSize: "0.85rem", fontWeight: "600", marginTop: "2px" }}>Latest 2026 Recruitment Pattern Active</p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => onStartPractice("interview")} className="glass-button primary">Start AI Interview</button>
                <button onClick={() => onStartPractice("crt")} className="glass-button">Attempt Mock Test</button>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Building2 size={16} color="var(--primary-neon)" />
                <span>Company Overview</span>
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>{selectedCompany.overview}</p>
            </div>

            {/* Salary & Eligibility Info cards */}
            <div className="display-grid grid-cols-2">
              <div className="glass-panel" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.01)" }}>
                <DollarSign size={20} color="var(--primary-neon)" />
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Average Salary Range</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text-primary)" }}>{selectedCompany.salary}</p>
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.01)" }}>
                <Award size={20} color="var(--secondary-neon)" />
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Eligibility Criteria</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: "bold", color: "var(--text-primary)" }}>{selectedCompany.eligibility}</p>
                </div>
              </div>
            </div>

            {/* Rounds & Patterns */}
            <div className="display-grid grid-cols-2">
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ListChecks size={16} color="var(--primary-neon)" />
                  <span>Selection Rounds</span>
                </h4>
                <ul style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "20px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  {selectedCompany.rounds.map((round) => (
                    <li key={round} style={{ lineHeight: "1.4" }}>{round}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Calendar size={16} color="var(--secondary-neon)" />
                  <span>Written Test Pattern</span>
                </h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>{selectedCompany.pattern}</p>
                
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginTop: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <BookOpen size={16} color="var(--accent-pink)" />
                  <span>Key Topics Asked</span>
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selectedCompany.topics.map((topic) => (
                    <span 
                      key={topic} 
                      style={{ 
                        fontSize: "0.75rem", 
                        padding: "3px 8px", 
                        borderRadius: "12px", 
                        background: "rgba(255,255,255,0.03)", 
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "var(--text-secondary)"
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Preparation Resources */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "12px" }}>Recommended Resources</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedCompany.resources.map((res) => (
                  <a
                    key={res}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--primary-neon)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span>📚 {res}</span>
                    <ArrowRight size={12} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-muted)" }}>
            Select a company to view preparation content.
          </div>
        )}
      </div>
    </div>
  );
};
