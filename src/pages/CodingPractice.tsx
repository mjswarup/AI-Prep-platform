import React, { useState, useEffect } from "react";
import { codingProblems, type CodingProblem } from "../mockData";
import { Code2, Play, HelpCircle, Terminal, Cpu } from "lucide-react";

interface CodingPracticeProps {
  onGainXp: (xp: number) => void;
}

export const CodingPractice: React.FC<CodingPracticeProps> = ({ onGainXp }) => {
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem>(codingProblems[0]);
  const [language, setLanguage] = useState<string>("cpp");
  const [code, setCode] = useState<string>("");

  // Compiler / Run states
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<{ status: "Passed" | "Failed" | "Error"; stdout: string; testCaseResults?: any[] } | null>(null);

  // AI Hints states
  const [showAiHint, setShowAiHint] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Set default code template when problem or language changes
  useEffect(() => {
    if (selectedProblem.templateCode[language]) {
      setCode(selectedProblem.templateCode[language]);
    } else {
      setCode(`// Templates not available. Write your code here.`);
    }
    setRunResult(null);
    setShowAiHint(false);
    setAiExplanation(null);
  }, [selectedProblem, language]);

  const handleRunCode = () => {
    setIsRunning(true);
    setRunResult(null);

    setTimeout(() => {
      setIsRunning(false);
      // Simulate compiler execution outcomes based on simple regex keywords
      const lowerCode = code.toLowerCase();
      
      let compilationPassed = false;

      // Simple keywords validations to mock actual coding checks
      if (selectedProblem.id === 1) { // Two Sum
        if (language === "python" && (lowerCode.includes("dict") || lowerCode.includes("hash") || lowerCode.includes("enumerate"))) {
          compilationPassed = true;
        } else if (language === "cpp" && (lowerCode.includes("unordered_map") || lowerCode.includes("map") || lowerCode.includes("for"))) {
          compilationPassed = true;
        } else if (lowerCode.includes("for") || lowerCode.includes("while")) {
          compilationPassed = true;
        }
      } else if (selectedProblem.id === 2) { // Longest Substring
        if (lowerCode.includes("max") && (lowerCode.includes("left") || lowerCode.includes("right") || lowerCode.includes("window") || lowerCode.includes("set") || lowerCode.includes("map") || lowerCode.includes("indexOf"))) {
          compilationPassed = true;
        }
      }

      if (compilationPassed) {
        setRunResult({
          status: "Passed",
          stdout: "All Test Cases Passed Successfully!\n\nTest Case 1: [2,7,11,15], target=9 -> Output: [0,1] (Expected: [0,1])\nTest Case 2: [3,2,4], target=6 -> Output: [1,2] (Expected: [1,2])",
          testCaseResults: [
            { case: 1, status: "Success", time: "12ms", memory: "8.4MB" },
            { case: 2, status: "Success", time: "18ms", memory: "8.6MB" }
          ]
        });
        onGainXp(150); // reward XP for passing
      } else {
        setRunResult({
          status: "Failed",
          stdout: "Test Case 1 Failed: Input: [2,7,11,15], target=9\nExpected: [0,1]\nReceived: []\n\nHint: Verify if your loop returns the indices when elements sum up to target.",
          testCaseResults: [
            { case: 1, status: "Failed", time: "0ms", memory: "0MB" },
            { case: 2, status: "Failed", time: "0ms", memory: "0MB" }
          ]
        });
      }
    }, 1500);
  };

  const handleAskAiExplanation = () => {
    if (selectedProblem.id === 1) {
      setAiExplanation(
        `Here is the O(N) solution using a Hash Map:\n\n` +
        `1. Create an empty hash map (unordered_map in C++, dict in Python).\n` +
        `2. Loop through the array with index 'i'.\n` +
        `3. Calculate 'complement = target - nums[i]'.\n` +
        `4. Check if 'complement' exists in the hash map. If yes, return its index and 'i'.\n` +
        `5. Otherwise, store 'nums[i]' in the map as key, and index 'i' as value.\n\n` +
        `Complexity Analysis:\n` +
        `- Time Complexity: O(N) since we traverse the list containing N elements exactly once. Map lookups take O(1).\n` +
        `- Space Complexity: O(N) to store the elements in the hash map.`
      );
    } else {
      setAiExplanation(
        `Here is the sliding window solution:\n\n` +
        `1. Use two pointers 'left' and 'right' representing boundaries of substring.\n` +
        `2. Keep a hash set to track characters currently inside the window.\n` +
        `3. Move 'right' index character-by-character. If character already in set, shrink window by incrementing 'left' and deleting from set until duplicate is gone.\n` +
        `4. Calculate length at each iteration ('right - left + 1') and record maximum.\n\n` +
        `Complexity Analysis:\n` +
        `- Time Complexity: O(N) since each character is visited at most twice (once by left, once by right).\n` +
        `- Space Complexity: O(min(M, N)) where M is alphabet size.`
      );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Coding Assessments Workspace</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          Solve algorithmic challenges, view time complexity details, and get AI hints.
        </p>
      </div>

      <div className="display-grid grid-cols-3" style={{ gridTemplateColumns: "1fr 2fr", alignItems: "start" }}>
        
        {/* Left column: Problem Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Problems Selector */}
          <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold" }}>PROBLEMS</span>
            {codingProblems.map((prob) => (
              <button
                key={prob.id}
                onClick={() => setSelectedProblem(prob)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: selectedProblem.id === prob.id ? "var(--primary-neon)" : "rgba(255,255,255,0.05)",
                  background: selectedProblem.id === prob.id ? "rgba(0, 229, 255, 0.05)" : "transparent",
                  color: selectedProblem.id === prob.id ? "var(--primary-neon)" : "var(--text-primary)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.85rem"
                }}
              >
                <span>{prob.title}</span>
                <span 
                  style={{ 
                    fontSize: "0.7rem", 
                    color: prob.difficulty === "Easy" ? "var(--primary-neon)" : prob.difficulty === "Medium" ? "#ffea00" : "var(--accent-pink)" 
                  }}
                >
                  {prob.difficulty}
                </span>
              </button>
            ))}
          </div>

          {/* Detailed Question Description */}
          <div className="glass-panel" style={{ padding: "24px", maxHeight: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>{selectedProblem.title}</h3>
              <div style={{ display: "flex", gap: "6px" }}>
                {selectedProblem.companyTags.slice(0, 2).map((t) => (
                  <span key={t} style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)" }}>{t}</span>
                ))}
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5", whiteSpace: "pre-line" }}>
              {selectedProblem.description}
            </p>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px", fontSize: "0.8rem" }}>
              <p style={{ fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>Sample Input</p>
              <pre style={{ background: "rgba(0,0,0,0.3)", padding: "8px", borderRadius: "6px", fontFamily: "var(--font-mono)", color: "var(--primary-neon)" }}>{selectedProblem.sampleInput}</pre>
              
              <p style={{ fontWeight: "bold", color: "var(--text-primary)", marginTop: "12px", marginBottom: "4px" }}>Sample Output</p>
              <pre style={{ background: "rgba(0,0,0,0.3)", padding: "8px", borderRadius: "6px", fontFamily: "var(--font-mono)", color: "var(--primary-neon)" }}>{selectedProblem.sampleOutput}</pre>
            </div>
          </div>
        </div>

        {/* Right column: Editor & Console Output */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Editor Header / Language selectors */}
          <div className="glass-panel" style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Code2 size={16} color="var(--primary-neon)" />
              <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Code Editor</span>
            </div>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="glass-input glass-select"
              style={{ width: "130px", padding: "6px 12px" }}
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          {/* Interactive Code Editor (simulated) */}
          <div style={{ position: "relative" }}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="glass-input"
              spellCheck={false}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                height: "300px",
                lineHeight: "1.5",
                background: "rgba(5, 5, 12, 0.75)",
                borderColor: "rgba(255, 255, 255, 0.08)",
                whiteSpace: "pre",
                overflow: "auto"
              }}
            />
          </div>

          {/* Actions bar */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="glass-button primary"
              style={{ flex: 1.5, justifyContent: "center" }}
            >
              {isRunning ? (
                <>
                  <div className="loader-spinner" style={{ width: "16px", height: "16px" }} />
                  <span>Compiling & Running...</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="#03030b" />
                  <span>Run Assessment Code</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => setShowAiHint(!showAiHint)} 
              className="glass-button" 
              style={{ flex: 1, justifyContent: "center" }}
            >
              <HelpCircle size={16} />
              <span>AI Hint</span>
            </button>
            
            <button 
              onClick={handleAskAiExplanation} 
              className="glass-button" 
              style={{ flex: 1.2, justifyContent: "center" }}
            >
              <Cpu size={16} />
              <span>AI Full Solution</span>
            </button>
          </div>

          {/* AI Hint Panel */}
          {showAiHint && (
            <div 
              className="glass-panel animate-slideIn" 
              style={{ 
                padding: "20px", 
                background: "rgba(0,229,255,0.02)", 
                borderColor: "var(--primary-neon)" 
              }}
            >
              <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--primary-neon)", marginBottom: "8px" }}>AI Helper - Hints</h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {selectedProblem.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Explanation Full Panel */}
          {aiExplanation && (
            <div 
              className="glass-panel animate-slideIn" 
              style={{ 
                padding: "20px", 
                background: "rgba(189,0,255,0.02)", 
                borderColor: "var(--secondary-neon)" 
              }}
            >
              <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--secondary-neon)", marginBottom: "8px" }}>AI Solution & Complexity analysis</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5", whiteSpace: "pre-line", fontFamily: "var(--font-mono)" }}>
                {aiExplanation}
              </p>
            </div>
          )}

          {/* Compile/Run Output Console */}
          {runResult && (
            <div 
              className="glass-panel" 
              style={{ 
                padding: "20px", 
                background: "rgba(3, 3, 11, 0.9)",
                borderColor: runResult.status === "Passed" ? "var(--primary-neon)" : "var(--accent-pink)" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Terminal size={14} color="var(--text-muted)" />
                  <span>Execution Console Output</span>
                </span>
                <span 
                  style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: "bold", 
                    color: runResult.status === "Passed" ? "var(--primary-neon)" : "var(--accent-pink)",
                    background: runResult.status === "Passed" ? "rgba(0, 229, 255, 0.1)" : "rgba(255,0,127,0.1)",
                    padding: "2px 8px",
                    borderRadius: "4px"
                  }}
                >
                  {runResult.status}
                </span>
              </div>

              {/* Console stdout logs */}
              <pre 
                style={{ 
                  fontFamily: "var(--font-mono)", 
                  fontSize: "0.8rem", 
                  color: "var(--text-secondary)", 
                  whiteSpace: "pre-line",
                  lineHeight: "1.4"
                }}
              >
                {runResult.stdout}
              </pre>

              {/* Performance indicators if passed */}
              {runResult.status === "Passed" && runResult.testCaseResults && (
                <div style={{ display: "flex", gap: "16px", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px" }}>
                  {runResult.testCaseResults.map((tc) => (
                    <div key={tc.case} style={{ fontSize: "0.75rem", display: "flex", gap: "8px", color: "var(--text-muted)" }}>
                      <span>Case {tc.case}: <strong style={{ color: "var(--primary-neon)" }}>{tc.status}</strong></span>
                      <span>•</span>
                      <span>Time: {tc.time}</span>
                      <span>•</span>
                      <span>Memory: {tc.memory}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
