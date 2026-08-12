import React, { useEffect, useState } from "react";
import { BookOpen, ShieldCheck, AlertTriangle, Clock3, Eye, Monitor, ScanEye } from "lucide-react";
import { buildMixedAssessment } from "../mockData";

interface QuestionItem {
  id: number;
  prompt: string;
  answer: string;
}

export const ExamArena: React.FC = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timeLeftMinutes, setTimeLeftMinutes] = useState(35);
  const [securityFlags, setSecurityFlags] = useState({
    tabSwitches: 0,
    focusLosses: 0,
    copyAttempts: 0,
    fullScreenExits: 0,
  });

  const [questions, setQuestions] = useState<QuestionItem[]>(() =>
    buildMixedAssessment(["technical", "written", "reasoning"], 8).map((prompt, index) => ({
      id: index + 1,
      prompt,
      answer: "",
    }))
  );

  useEffect(() => {
    if (!examStarted) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setSecurityFlags((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
      }
    };

    const handleBlur = () => {
      setSecurityFlags((prev) => ({ ...prev, focusLosses: prev.focusLosses + 1 }));
    };

    const handleFullscreen = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullScreen(active);
      if (!active) {
        setSecurityFlags((prev) => ({ ...prev, fullScreenExits: prev.fullScreenExits + 1 }));
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      setSecurityFlags((prev) => ({ ...prev, copyAttempts: prev.copyAttempts + 1 }));
    };

    const handleCopyPaste = (event: Event) => {
      event.preventDefault();
      setSecurityFlags((prev) => ({ ...prev, copyAttempts: prev.copyAttempts + 1 }));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const blocked = ["F12", "F5", "Tab", "Escape"]; 
      const modifierKeys = event.ctrlKey || event.metaKey || event.altKey;

      if (blocked.includes(event.key) || (modifierKeys && ["c", "v", "x", "p", "s", "u"].includes(event.key.toLowerCase()))) {
        event.preventDefault();
        setSecurityFlags((prev) => ({ ...prev, copyAttempts: prev.copyAttempts + 1 }));
      }

      if (event.key === "Tab") {
        setSecurityFlags((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [examStarted]);

  useEffect(() => {
    if (!examStarted || submitted) return;

    const timer = window.setInterval(() => {
      setTimeLeftMinutes((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 60000);

    return () => window.clearInterval(timer);
  }, [examStarted, submitted]);

  useEffect(() => {
    if (!examStarted) return;

    if (securityFlags.tabSwitches >= 3 || securityFlags.copyAttempts >= 2 || securityFlags.fullScreenExits >= 1) {
      setSubmitted(true);
      setExamStarted(false);
    }
  }, [examStarted, securityFlags]);

  const startExam = async () => {
    setSubmitted(false);
    setExamStarted(true);
    setCurrentIndex(0);
    setSecurityFlags({
      tabSwitches: 0,
      focusLosses: 0,
      copyAttempts: 0,
      fullScreenExits: 0,
    });

    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.warn("Fullscreen request denied or not supported:", error);
      }
    }
  };

  const updateAnswer = (value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const currentQuestion = updated[currentIndex];
      if (!currentQuestion) return prev;

      updated[currentIndex] = { ...currentQuestion, answer: value };
      return updated;
    });
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((q) => q.answer.trim().length > 0).length;

  const summaryBadges = [
    { label: "Tab switches", value: securityFlags.tabSwitches, icon: Eye },
    { label: "Copy attempts", value: securityFlags.copyAttempts, icon: ShieldCheck },
    { label: "Focus loss", value: securityFlags.focusLosses, icon: AlertTriangle },
    { label: "Fullscreen", value: isFullScreen ? "On" : "Off", icon: Monitor },
  ];

  if (!examStarted && !submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "28px" }}>
        <div className="glass-panel" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <ShieldCheck size={24} color="var(--primary-neon)" />
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "900" }}>Placement Assessment Security Lock</h2>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "18px" }}>
            This exam combines previous-year technical and written patterns into a mixed placement-prep assessment. It enforces full-screen mode,
            blocks copy-paste, and logs tab-switch and focus-loss events to reduce cheating risk.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "22px" }}>
            {summaryBadges.map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-panel" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Icon size={16} color="var(--secondary-neon)" />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</span>
                </div>
                <strong style={{ fontSize: "1.25rem" }}>{String(value)}</strong>
              </div>
            ))}
          </div>

          <button className="glass-button primary" onClick={startExam} style={{ justifyContent: "center", padding: "12px 18px" }}>
            Start Secure Assessment
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "28px" }}>
        <div className="glass-panel" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <ScanEye size={24} color="var(--accent-pink)" />
            <h2 style={{ margin: 0, fontSize: "1.9rem", fontWeight: "900" }}>Assessment Session Closed</h2>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            The session ended because a security rule was triggered. This is a safe protection pattern for online tests and helps prevent cheating or external-app usage.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginTop: "18px" }}>
            <div className="glass-panel" style={{ padding: "14px" }}>
              <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>Tab switches</span>
              <strong style={{ fontSize: "1.2rem" }}>{securityFlags.tabSwitches}</strong>
            </div>
            <div className="glass-panel" style={{ padding: "14px" }}>
              <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>Copy attempts</span>
              <strong style={{ fontSize: "1.2rem" }}>{securityFlags.copyAttempts}</strong>
            </div>
            <div className="glass-panel" style={{ padding: "14px" }}>
              <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>Answered</span>
              <strong style={{ fontSize: "1.2rem" }}>{answeredCount}/{questions.length}</strong>
            </div>
          </div>

          <button className="glass-button primary" onClick={() => setSubmitted(false)} style={{ marginTop: "20px", justifyContent: "center", padding: "12px 18px" }}>
            Review Security Summary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", padding: "26px" }}>
      <div className="glass-panel" style={{ padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BookOpen size={22} color="var(--primary-neon)" />
            <div>
              <h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: "900" }}>Mixed Previous-Year Assessment</h2>
              <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>Technical + Written + Reasoning pattern</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Clock3 size={16} color="var(--secondary-neon)" />
              {timeLeftMinutes} min left
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Monitor size={16} color="var(--primary-neon)" />
              {isFullScreen ? "Full-screen active" : "Not in full-screen"}
            </span>
          </div>
        </div>
      </div>

      <div className="display-grid grid-cols-4">
        {summaryBadges.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-panel" style={{ padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Icon size={15} color="var(--secondary-neon)" />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{label}</span>
            </div>
            <strong style={{ fontSize: "1.1rem" }}>{String(value)}</strong>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "800" }}>Question {currentIndex + 1} of {questions.length}</h3>
          <button className="glass-button" onClick={() => document.documentElement.requestFullscreen?.()} style={{ justifyContent: "center" }}>
            Re-enter Full Screen
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text-primary)" }}>{currentQuestion.prompt}</p>

          <textarea
            value={currentQuestion.answer}
            onChange={(event) => updateAnswer(event.target.value)}
            placeholder="Write your answer here..."
            className="glass-input"
            style={{ minHeight: "150px", resize: "vertical", fontSize: "0.9rem" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginTop: "22px", flexWrap: "wrap" }}>
          <button
            className="glass-button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
          >
            Previous
          </button>

          <button
            className="glass-button primary"
            onClick={() => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
              } else {
                setSubmitted(true);
              }
            }}
          >
            {currentIndex === questions.length - 1 ? "Submit Assessment" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};
