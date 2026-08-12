import React, { useState } from "react";
import { companiesData, crtQuestions, previousYearPaperBank, buildMixedAssessment, type Company, type CRTQuestion } from "../mockData";
import { Database, Plus, Trash2, BookOpen, FolderOpen } from "lucide-react";

export const AdminPanel: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(companiesData);
  const [questions, setQuestions] = useState<CRTQuestion[]>(crtQuestions);
  const mixedAssessment = buildMixedAssessment(["technical", "written", "reasoning"], 8);
  
  // Modal / Inputs state for adding new company
  const [newCompName, setNewCompName] = useState("");
  const [newCompSalary, setNewCompSalary] = useState("");
  const [newCompEligibility, setNewCompEligibility] = useState("");

  // Modal / Inputs state for adding new question
  const [newQText, setNewQText] = useState("");
  const [newQCategory, setNewQCategory] = useState<"Quantitative" | "Logical" | "Verbal" | "Debugging" | "Puzzles">("Quantitative");
  const [newQAnswer, setNewQAnswer] = useState("");

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const newComp: Company = {
      name: newCompName,
      logo: newCompName.slice(0, 2),
      overview: "Mock newly added company details through the platform admin dashboard controls.",
      salary: newCompSalary || "₹6.0 LPA - ₹12.0 LPA",
      eligibility: newCompEligibility || "CGPA > 6.5",
      rounds: ["Cognitive Round", "Technical coding", "HR Interview"],
      pattern: "Aptitude + Basic programming questions",
      topics: ["Arrays", "Puzzles", "Aptitude"],
      resources: ["GfG Practice Papers"]
    };

    setCompanies([newComp, ...companies]);
    setNewCompName("");
    setNewCompSalary("");
    setNewCompEligibility("");
  };

  const [folderMessage, setFolderMessage] = useState("");

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newQAnswer.trim()) return;

    const newQ: CRTQuestion = {
      id: Date.now(),
      category: newQCategory,
      difficulty: "Medium",
      question: newQText,
      options: [newQAnswer, "Incorrect Option A", "Incorrect Option B", "Incorrect Option C"],
      correctAnswer: newQAnswer,
      explanation: "Mock solution explanation generated dynamically via admin panel dashboard triggers."
    };

    setQuestions([newQ, ...questions]);
    setNewQText("");
    setNewQAnswer("");
  };

  const handleOpenMockPaperFolder = async () => {
    try {
      const response = await fetch('/api/mock-papers/open', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        setFolderMessage(data.error?.message || 'Unable to open folder.');
      } else {
        setFolderMessage(data.message || 'Opened mock_papers folder.');
      }
    } catch (error) {
      console.error('Open folder error:', error);
      setFolderMessage('Unable to open mock_papers folder.');
    }
  };

  const handleDeleteCompany = (name: string) => {
    setCompanies(companies.filter(c => c.name !== name));
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Admin Control Panel</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          Manage company study cards, assessment question pools, user stats, and system parameters.
        </p>
      </div>

      {/* Admin stats widgets */}
      <div className="display-grid grid-cols-4">
        <div className="glass-panel" style={{ padding: "20px" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Registered Students</p>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary-neon)", marginTop: "4px" }}>1,248</h3>
        </div>
        <div className="glass-panel" style={{ padding: "20px" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Live Companies</p>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--secondary-neon)", marginTop: "4px" }}>{companies.length}</h3>
        </div>
        <div className="glass-panel" style={{ padding: "20px" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Assessment Questions</p>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--accent-pink)", marginTop: "4px" }}>{questions.length}</h3>
        </div>
        <div className="glass-panel" style={{ padding: "20px" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Paper Bank Entries</p>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#ffea00", marginTop: "4px" }}>{previousYearPaperBank.length}</h3>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <FolderOpen size={18} color="var(--secondary-neon)" />
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800" }}>Admin Folder Access</h3>
        </div>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Open the server folder that stores uploaded mock paper files directly from the admin dashboard.
        </p>
        <button onClick={handleOpenMockPaperFolder} className="glass-button primary" style={{ width: "fit-content" }}>
          Open mock_papers folder
        </button>
        {folderMessage && (
          <p style={{ margin: "0", color: "var(--text-primary)", fontSize: "0.9rem" }}>{folderMessage}</p>
        )}
      </div>

      <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOpen size={16} color="var(--primary-neon)" />
          <span>Previous Year Paper Bank</span>
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {previousYearPaperBank.map((paper) => (
            <div key={paper.id} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.08em", color: "var(--primary-neon)", textTransform: "uppercase" }}>{paper.category}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{paper.year}</span>
              </div>
              <h4 style={{ fontSize: "0.96rem", fontWeight: "700", margin: "0 0 8px" }}>{paper.title}</h4>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0 0 10px" }}>
                {paper.durationMinutes} min • {paper.difficulty}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {paper.focus.map((topic) => (
                  <span key={`${paper.id}-${topic}`} style={{ fontSize: "0.7rem", background: "rgba(0, 229, 255, 0.08)", padding: "4px 7px", borderRadius: "999px", color: "var(--text-primary)" }}>{topic}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(0, 229, 255, 0.05)", borderRadius: "12px", padding: "12px 14px", border: "1px solid rgba(0, 229, 255, 0.12)" }}>
          <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>Mixed assessment preview</p>
          <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--text-primary)", fontSize: "0.8rem", display: "grid", gap: "6px" }}>
            {mixedAssessment.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="display-grid grid-cols-2">
        
        {/* Left: Manage Companies */}
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={16} color="var(--primary-neon)" />
            <span>Add Placement Company</span>
          </h3>

          <form onSubmit={handleAddCompany} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input 
              type="text" 
              placeholder="Company Name (e.g. Oracle)" 
              value={newCompName}
              onChange={(e) => setNewCompName(e.target.value)}
              className="glass-input" 
              style={{ fontSize: "0.85rem" }}
              required
            />
            <input 
              type="text" 
              placeholder="Salary Bracket (e.g. ₹8 LPA - ₹15 LPA)" 
              value={newCompSalary}
              onChange={(e) => setNewCompSalary(e.target.value)}
              className="glass-input" 
              style={{ fontSize: "0.85rem" }}
            />
            <input 
              type="text" 
              placeholder="Eligibility (e.g. CGPA > 7.0)" 
              value={newCompEligibility}
              onChange={(e) => setNewCompEligibility(e.target.value)}
              className="glass-input" 
              style={{ fontSize: "0.85rem" }}
            />
            <button type="submit" className="glass-button primary" style={{ padding: "10px", justifyContent: "center" }}>
              Add Company Card
            </button>
          </form>

          {/* List existing companies with delete */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginTop: "8px" }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "12px" }}>Existing Companies</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
              {companies.map((c) => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: "6px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>{c.name} ({c.salary})</span>
                  <button onClick={() => handleDeleteCompany(c.name)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--accent-pink)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Manage Assessment Questions */}
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
            <Database size={16} color="var(--secondary-neon)" />
            <span>Add CRT Practice Question</span>
          </h3>

          <form onSubmit={handleAddQuestion} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <textarea 
              placeholder="Question details text..." 
              value={newQText}
              onChange={(e) => setNewQText(e.target.value)}
              className="glass-input" 
              style={{ fontSize: "0.85rem", height: "70px" }}
              required
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <select 
                value={newQCategory} 
                onChange={(e) => setNewQCategory(e.target.value as any)} 
                className="glass-input glass-select"
                style={{ flex: 1, padding: "8px" }}
              >
                <option value="Quantitative">Quantitative</option>
                <option value="Logical">Logical</option>
                <option value="Verbal">Verbal</option>
                <option value="Debugging">Debugging</option>
                <option value="Puzzles">Puzzles</option>
              </select>
              
              <input 
                type="text" 
                placeholder="Correct Answer" 
                value={newQAnswer}
                onChange={(e) => setNewQAnswer(e.target.value)}
                className="glass-input" 
                style={{ flex: 1.5, fontSize: "0.85rem" }}
                required
              />
            </div>
            <button type="submit" className="glass-button primary" style={{ padding: "10px", justifyContent: "center" }}>
              Add Question
            </button>
          </form>

          {/* List existing questions */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginTop: "8px" }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "12px" }}>Existing CRT Questions</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
              {questions.map((q) => (
                <div key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: "6px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
                    [{q.category}] {q.question}
                  </span>
                  <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--accent-pink)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
