import React, { useState, useEffect, useRef } from "react";
import { mockInterviewQuestions } from "../mockData";
import type { InterviewDialog } from "../mockData";
import { RadarChart } from "../components/RadarChart";
import { Mic, MicOff, Play, Sparkles, Volume2, CheckCircle2, ChevronRight } from "lucide-react";

interface VoiceInterviewProps {
  onGainXp: (xp: number) => void;
}

export const VoiceInterview: React.FC<VoiceInterviewProps> = ({ onGainXp }) => {
  // Navigation steps: 1: Setup, 2: Session active, 3: Evaluation results
  const [step, setStep] = useState(1);

  // Setup configuration states
  const [company, setCompany] = useState("Amazon");
  const [role, setRole] = useState("Software Engineer");
  const [type, setType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");

  // Interview session states
  const [dialogs, setDialogs] = useState<InterviewDialog[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userSpeechInput, setUserSpeechInput] = useState("");
  const [chatInputFallback, setChatInputFallback] = useState("");

  // Speech Recognition API reference
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Load standard question pool
  const questionsList = mockInterviewQuestions[role] || mockInterviewQuestions["Software Engineer"];

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserSpeechInput(transcript);
        setChatInputFallback(transcript);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Make AI speak the question
  const speakQuestion = (text: string) => {
    if (!synthRef.current) return;
    
    // Stop any current speakings
    synthRef.current.cancel();
    
    setIsAiSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt standard voices
    const voices = synthRef.current.getVoices();
    const googleVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Natural"));
    if (googleVoice) utterance.voice = googleVoice;

    utterance.onend = () => {
      setIsAiSpeaking(false);
      // Auto trigger listening after AI finishes speaking
      startListening();
    };

    synthRef.current.speak(utterance);
  };

  const startInterview = () => {
    setStep(2);
    setDialogs([]);
    setCurrentQuestionIdx(0);
    setUserSpeechInput("");
    setChatInputFallback("");

    // Start with introduction greeting
    const introText = `Welcome to your ${difficulty} difficulty ${type} interview for ${company}. Let's begin. ${questionsList[0]}`;
    
    setTimeout(() => {
      setDialogs([
        { speaker: "AI", text: introText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      speakQuestion(introText);
    }, 500);
  };

  const startListening = () => {
    if (recognitionRef.current && !isAiSpeaking) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Speech recognition already started", e);
        // Recognition already running
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // User submits answer
  const handleUserAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const answerText = chatInputFallback || userSpeechInput;
    if (!answerText.trim()) return;

    // Append user dialogue
    const newDialogs = [
      ...dialogs,
      { speaker: "User" as const, text: answerText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setDialogs(newDialogs);
    setChatInputFallback("");
    setUserSpeechInput("");

    // Proceed to next question or evaluate
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < questionsList.length) {
      setCurrentQuestionIdx(nextIdx);
      const nextQ = questionsList[nextIdx];
      
      // Delay AI response for conversational feel
      setTimeout(() => {
        setDialogs(prev => [
          ...prev,
          { speaker: "AI" as const, text: nextQ, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        speakQuestion(nextQ);
      }, 1000);
    } else {
      // Finished all questions
      setTimeout(() => {
        setDialogs(prev => [
          ...prev,
          { speaker: "AI" as const, text: "Excellent. That concludes our interview round. Let's process your feedback scores.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        speakQuestion("Excellent. That concludes our interview round. Let's process your feedback scores.");
      }, 1000);
    }
  };

  const handleEvaluate = () => {
    // End interview speech synthesis
    if (synthRef.current) synthRef.current.cancel();
    setStep(3);
    onGainXp(300); // 300 XP awarded for full mock interview completion
  };

  // Mock evaluation statistics
  const evaluationScores = {
    communication: 84,
    confidence: 88,
    grammar: 78,
    fluency: 82,
    technical: 75,
    problemSolving: 80
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>AI Voice Interview Agent</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          Interactive verbal mock tests simulating SDE hiring managers.
        </p>
      </div>

      {/* STEP 1: INTERVIEW CONFIGURATION */}
      {step === 1 && (
        <div className="glass-panel" style={{ padding: "36px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} color="var(--primary-neon)" />
            <span>Configure Assessment Parameters</span>
          </h3>

          <div className="display-grid grid-cols-2" style={{ gap: "20px" }}>
            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Select Target Company</label>
              <select value={company} onChange={(e) => setCompany(e.target.value)} className="glass-input glass-select">
                <option value="Amazon">Amazon</option>
                <option value="Google">Google</option>
                <option value="TCS">TCS</option>
                <option value="Accenture">Accenture</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Deloitte">Deloitte</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Select Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="glass-input glass-select">
                <option value="Software Engineer">Software Engineer (SDE)</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="AI Engineer">AI Engineer</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Interview Category</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="glass-input glass-select">
                <option value="Technical">Technical</option>
                <option value="HR & Cultural">HR & Cultural</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Mixed Round">Mixed Round</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Select Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="glass-input glass-select">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "8px", background: "rgba(0, 229, 255, 0.05)", border: "1px solid rgba(0, 229, 255, 0.15)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <Volume2 size={16} color="var(--primary-neon)" />
            <span>Note: This simulator requests microphone permission. Ensure speakers are turned on for vocal questions.</span>
          </div>

          <button onClick={startInterview} className="glass-button primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            <Play size={16} fill="#03030b" />
            <span>Start Voice Interview Session</span>
          </button>
        </div>
      )}

      {/* STEP 2: ACTIVE VOICE SESSION INTERFACE */}
      {step === 2 && (
        <div className="display-grid grid-cols-3" style={{ gridTemplateColumns: "1.2fr 2fr", alignItems: "stretch" }}>
          
          {/* Left panel: Voice wave & Avatar animations */}
          <div className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "32px", textAlign: "center" }}>
            
            {/* Hologram speaking avatar */}
            <div className={`avatar-container ${isAiSpeaking ? "speaking" : ""}`}>
              <div className="avatar-ring" />
              <div className="avatar-ring" />
              <div className="avatar-ring" />
              <div className="avatar-face">
                <Volume2 size={40} color={isAiSpeaking ? "var(--primary-neon)" : "var(--text-secondary)"} style={{ transition: "color 0.3s" }} />
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Jarvis Placement Agent</h4>
              <p style={{ fontSize: "0.8rem", color: isAiSpeaking ? "var(--primary-neon)" : isListening ? "var(--secondary-neon)" : "var(--text-muted)", marginTop: "4px" }}>
                {isAiSpeaking ? "SPEAKER ACTIVE" : isListening ? "LISTENING..." : "AWAITING ANSWER"}
              </p>
            </div>

            {/* Speach Waveform */}
            <div className={`waveform-container ${isAiSpeaking || isListening ? "active" : ""}`}>
              <div className="waveform-bar" style={{ height: isAiSpeaking ? "40px" : "15px" }} />
              <div className="waveform-bar" style={{ height: isAiSpeaking ? "55px" : "18px" }} />
              <div className="waveform-bar" style={{ height: isAiSpeaking ? "25px" : "10px" }} />
              <div className="waveform-bar" style={{ height: isAiSpeaking ? "65px" : "20px" }} />
              <div className="waveform-bar" style={{ height: isAiSpeaking ? "45px" : "15px" }} />
              <div className="waveform-bar" style={{ height: isAiSpeaking ? "50px" : "16px" }} />
              <div className="waveform-bar" style={{ height: isAiSpeaking ? "20px" : "10px" }} />
            </div>

            {/* Mic Controls */}
            <div style={{ display: "flex", gap: "12px", width: "100%" }}>
              <button 
                onClick={isListening ? stopListening : startListening}
                className="glass-button" 
                style={{ 
                  flex: 1, 
                  justifyContent: "center",
                  borderColor: isListening ? "var(--secondary-neon)" : "rgba(255,255,255,0.08)",
                  background: isListening ? "rgba(189,0,255,0.05)" : "transparent"
                }}
              >
                {isListening ? <MicOff size={16} color="var(--secondary-neon)" /> : <Mic size={16} />}
                <span>{isListening ? "Mute Mic" : "Unmute Mic"}</span>
              </button>
              
              <button onClick={handleEvaluate} className="glass-button" style={{ flex: 1.2, justifyContent: "center", borderColor: "var(--accent-pink)", color: "var(--accent-pink)" }}>
                <span>End & Evaluate</span>
              </button>
            </div>
          </div>

          {/* Right panel: Chat dialogue transcripts */}
          <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", height: "500px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", marginBottom: "16px" }}>
              CONVERSATION TRANSCRIPT
            </span>

            {/* Dialog lines */}
            <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", paddingRight: "8px", marginBottom: "16px" }}>
              {dialogs.map((d, index) => (
                <div 
                  key={`${d.speaker}-${d.timestamp}-${index}`} 
                  style={{ 
                    alignSelf: d.speaker === "AI" ? "flex-start" : "flex-end",
                    maxWidth: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: d.speaker === "AI" ? "flex-start" : "flex-end"
                  }}
                >
                  <div 
                    style={{ 
                      padding: "12px 16px", 
                      borderRadius: "14px", 
                      borderTopLeftRadius: d.speaker === "AI" ? "2px" : "14px",
                      borderTopRightRadius: d.speaker === "User" ? "2px" : "14px",
                      background: d.speaker === "AI" ? "rgba(255,255,255,0.02)" : "rgba(0, 229, 255, 0.05)",
                      border: "1px solid",
                      borderColor: d.speaker === "AI" ? "rgba(255,255,255,0.06)" : "rgba(0, 229, 255, 0.15)",
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      lineHeight: "1.4"
                    }}
                  >
                    {d.text}
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {d.speaker} • {d.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Fallback keyboard entry */}
            <form onSubmit={handleUserAnswer} style={{ display: "flex", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
              <input 
                type="text" 
                placeholder={isListening ? "Listening verbally... or type answer here" : "Type answer here and press enter..."}
                value={chatInputFallback}
                onChange={(e) => setChatInputFallback(e.target.value)}
                className="glass-input"
                style={{ fontSize: "0.85rem" }}
              />
              <button type="submit" className="glass-button primary" style={{ padding: "10px 18px" }}>Send</button>
            </form>
          </div>

        </div>
      )}

      {/* STEP 3: EVALUATION RESULTS REPORT */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          <div className="display-grid grid-cols-2" style={{ gridTemplateColumns: "1.2fr 2fr" }}>
            
            {/* Left: Radar Chart scores */}
            <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "bold", marginBottom: "16px" }}>EVALUATION MATRIX</span>
              <RadarChart scores={evaluationScores} size={280} />
            </div>

            {/* Right: Scores & Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Score header summary */}
              <div className="glass-panel" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", background: "rgba(0, 229, 255, 0.02)", borderColor: "var(--primary-neon)" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", background: "rgba(0, 229, 255, 0.1)", color: "var(--primary-neon)", padding: "3px 8px", borderRadius: "6px", fontWeight: "bold" }}>ASSESSMENT COMPLETED</span>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "800", marginTop: "8px" }}>Overall Interview Score: 81%</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>Excellent confidence level. Focus on structuring technical code answers.</p>
                </div>
                
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>XP REWARD</p>
                  <h4 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#ffea00" }}>+300 XP</h4>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "bold" }}>AI Evaluation Insights</h4>
                
                <div className="display-grid grid-cols-2">
                  <div>
                    <h5 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary-neon)", marginBottom: "8px" }}>✓ Key Strengths</h5>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      <li>Maintained strong, confident voice vocabulary.</li>
                      <li>Explained design tradeoffs logically.</li>
                      <li>Clear communication structures.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--accent-pink)", marginBottom: "8px" }}>✗ Weak Areas</h5>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      <li>Vocabulary pacing was slightly too fast (150 wpm).</li>
                      <li>Missed specific garbage collection mechanics details.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Improvement Roadmaps */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <CheckCircle2 size={18} color="var(--primary-neon)" />
              <span>Personalized Preparation Roadmap</span>
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <p>1. 📘 <strong>Review:</strong> Study JVM/V8 Engine garbage collection algorithms under our <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ color: "var(--primary-neon)" }}>Resources page</a>.</p>
              <p>2. 🛠 <strong>Coding:</strong> Solve 2 medium questions on maps/sets to strengthen problem-solving capabilities.</p>
              <p>3. 🎙 <strong>Practice:</strong> Re-attempt Amazon Technical mock interview next week at <strong>Hard difficulty</strong>.</p>
            </div>
            
            <button onClick={() => setStep(1)} className="glass-button primary" style={{ marginTop: "16px" }}>
              <span>Configure Next Interview</span>
              <ChevronRight size={16} fill="#03030b" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
