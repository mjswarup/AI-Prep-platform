import React, { useState, useEffect, useCallback } from "react";
import { crtQuestions } from "../mockData";
import type { CRTQuestion } from "../mockData";
import { BookOpen, Timer, Check, X, RefreshCw } from "lucide-react";

interface DailyCRTProps {
  onGainXp: (xp: number) => void;
}

export const DailyCRT: React.FC<DailyCRTProps> = ({ onGainXp }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [questions, setQuestions] = useState<CRTQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: string }>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [timerActive, setTimerActive] = useState(false);

  const categories = ["All", "Quantitative", "Logical", "Verbal", "Debugging", "Puzzles"];

  const handleSubmitQuiz = useCallback(() => {
    setTimerActive(false);
    setQuizSubmitted(true);

    // Calculate score details (+4 for correct, -1 for incorrect)
    let correctCount = 0;
    let wrongCount = 0;
    
    questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (userAns) {
        if (userAns === q.correctAnswer) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const totalScore = correctCount * 4 - wrongCount * 1;
    const xpGained = Math.max(0, totalScore * 5); // 5 XP per score point
    if (xpGained > 0) {
      onGainXp(xpGained);
    }
  }, [questions, selectedAnswers, onGainXp]);

  // Filter questions based on criteria
  useEffect(() => {
    let filtered = crtQuestions.filter((q) => q.difficulty === selectedDifficulty);
    if (selectedCategory !== "All") {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }
    setQuestions(filtered);
  }, [selectedDifficulty, selectedCategory]);

  // Handle countdown timer
  useEffect(() => {
    let timer: any;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Auto-submit on timeout
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [timeLeft, timerActive, handleSubmitQuiz]);

  const startQuiz = () => {
    if (questions.length === 0) {
      alert("No questions found for the selected filters!");
      return;
    }
    setQuizStarted(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeft(300);
    setTimerActive(true);
  };

  const handleSelectAnswer = (questionId: number, answer: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculations for results display
  const getResultsSummary = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (!userAns) {
        unattempted++;
      } else if (userAns === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = correct * 4 - wrong * 1;
    return { correct, wrong, unattempted, score };
  };

  const results = quizSubmitted ? getResultsSummary() : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      
      {/* Title section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Daily CRT Preparation</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
            Improve quantitative, logical reasoning, and debugging skills.
          </p>
        </div>
        
        {quizStarted && !quizSubmitted && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: "10px 18px", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              borderColor: timeLeft < 60 ? "var(--accent-pink)" : "var(--primary-neon)",
              background: timeLeft < 60 ? "rgba(255,0,127,0.05)" : "rgba(0,229,255,0.05)" 
            }}
          >
            <Timer size={16} color={timeLeft < 60 ? "var(--accent-pink)" : "var(--primary-neon)"} />
            <span style={{ fontSize: "1rem", fontWeight: "bold", fontFamily: "var(--font-mono)", color: timeLeft < 60 ? "var(--accent-pink)" : "var(--primary-neon)" }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* FILTER PANEL */}
      {!quizStarted && (
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            
            {/* Difficulty select */}
            <div>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Difficulty</label>
              <div style={{ display: "flex", gap: "6px" }}>
                {["Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff as any)}
                    className={`glass-button ${selectedDifficulty === diff ? "active" : ""}`}
                    style={{ fontSize: "0.85rem", padding: "6px 14px" }}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Start test CTA */}
            <button onClick={startQuiz} className="glass-button primary" style={{ padding: "12px 24px" }}>
              <span>Start Daily Challenge</span>
              <BookOpen size={16} fill="#03030b" />
            </button>
          </div>

          {/* Category filter */}
          <div>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "8px" }}>Domain Category</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: selectedCategory === cat ? "var(--primary-neon)" : "rgba(255,255,255,0.06)",
                    background: selectedCategory === cat ? "rgba(0, 229, 255, 0.15)" : "transparent",
                    color: selectedCategory === cat ? "var(--primary-neon)" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    transition: "all 0.2s"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUIZ INTERACTIVE INTERFACE */}
      {quizStarted && questions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Question Index Sidebar + Question Panel */}
          <div className="display-grid grid-cols-3" style={{ gridTemplateColumns: "1fr 3fr", alignItems: "start" }}>
            
            {/* Left Qs Index */}
            <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "bold" }}>QUESTIONS</span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIdx;
                  let btnBg = "transparent";
                  let btnBorder = "rgba(255,255,255,0.08)";
                  let btnText = "var(--text-secondary)";

                  if (isCurrent) {
                    btnBg = "rgba(0, 229, 255, 0.1)";
                    btnBorder = "var(--primary-neon)";
                    btnText = "var(--primary-neon)";
                  } else if (isAnswered) {
                    btnBg = "rgba(255,255,255,0.05)";
                    btnBorder = "rgba(255,255,255,0.2)";
                    btnText = "var(--text-primary)";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: btnBorder,
                        background: btnBg,
                        color: btnText,
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Question Detail Card */}
            <div className="glass-panel" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                <span 
                  style={{ 
                    fontSize: "0.75rem", 
                    background: "rgba(0, 229, 255, 0.1)", 
                    color: "var(--primary-neon)", 
                    padding: "3px 8px", 
                    borderRadius: "6px",
                    fontWeight: "bold" 
                  }}
                >
                  {questions[currentQuestionIdx].category}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Question {currentQuestionIdx + 1} of {questions.length}</span>
              </div>

              {/* Question Text */}
              <p style={{ fontSize: "1.1rem", fontWeight: "500", lineHeight: "1.5" }}>
                {questions[currentQuestionIdx].question}
              </p>

              {/* Code snippet if exists */}
              {questions[currentQuestionIdx].codeSnippet && (
                <pre 
                  style={{ 
                    background: "rgba(0,0,0,0.4)", 
                    padding: "16px", 
                    borderRadius: "10px", 
                    border: "1px solid rgba(255,255,255,0.05)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    overflowX: "auto",
                    color: "#00e5ff"
                  }}
                >
                  <code>{questions[currentQuestionIdx].codeSnippet}</code>
                </pre>
              )}

              {/* MCQ Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {questions[currentQuestionIdx].options.map((option) => {
                  const isSelected = selectedAnswers[questions[currentQuestionIdx].id] === option;
                  const isCorrect = option === questions[currentQuestionIdx].correctAnswer;
                  
                  let optionBg = "rgba(255,255,255,0.01)";
                  let optionBorder = "rgba(255,255,255,0.06)";

                  if (quizSubmitted) {
                    if (isCorrect) {
                      optionBg = "rgba(0, 229, 255, 0.1)";
                      optionBorder = "var(--primary-neon)";
                    } else if (isSelected && !isCorrect) {
                      optionBg = "rgba(255,0,127,0.1)";
                      optionBorder = "var(--accent-pink)";
                    }
                  } else if (isSelected) {
                    optionBg = "rgba(255, 255, 255, 0.05)";
                    optionBorder = "var(--primary-neon)";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectAnswer(questions[currentQuestionIdx].id, option)}
                      disabled={quizSubmitted}
                      style={{
                        padding: "14px 20px",
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: optionBorder,
                        background: optionBg,
                        color: "var(--text-primary)",
                        textAlign: "left",
                        cursor: quizSubmitted ? "default" : "pointer",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s"
                      }}
                    >
                      <span>{option}</span>
                      {quizSubmitted && isCorrect && <Check size={16} color="var(--primary-neon)" />}
                      {quizSubmitted && isSelected && !isCorrect && <X size={16} color="var(--accent-pink)" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanations shown after submit */}
              {quizSubmitted && (
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: "16px 20px", 
                    background: "rgba(255,255,255,0.01)",
                    borderLeft: "4px solid var(--primary-neon)" 
                  }}
                >
                  <h5 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary-neon)", marginBottom: "4px" }}>EXPLANATION</h5>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {questions[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}

              {/* Controls bar */}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px", marginTop: "12px" }}>
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                  className="glass-button"
                  style={{ opacity: currentQuestionIdx === 0 ? 0.3 : 1 }}
                >
                  Previous
                </button>

                {quizSubmitted ? (
                  <button onClick={() => setQuizStarted(false)} className="glass-button primary">
                    <RefreshCw size={14} /> Back to Filters
                  </button>
                ) : (
                  <button onClick={handleSubmitQuiz} className="glass-button" style={{ borderColor: "var(--accent-pink)", color: "var(--accent-pink)" }}>
                    Submit Assessment
                  </button>
                )}

                <button
                  disabled={currentQuestionIdx === questions.length - 1}
                  onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                  className="glass-button"
                  style={{ opacity: currentQuestionIdx === questions.length - 1 ? 0.3 : 1 }}
                >
                  Next
                </button>
              </div>

            </div>
          </div>

          {/* RESULTS DISPLAY PANEL */}
          {quizSubmitted && results && (
            <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px", background: "rgba(0, 229, 255, 0.02)", borderColor: "var(--primary-neon)" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800" }}>Assessment Report Summary</h3>
              
              <div className="display-grid grid-cols-4">
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Correct Answers</p>
                  <h4 style={{ fontSize: "2rem", fontWeight: "900", color: "var(--primary-neon)" }}>{results.correct}</h4>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Incorrect Answers</p>
                  <h4 style={{ fontSize: "2rem", fontWeight: "900", color: "var(--accent-pink)" }}>{results.wrong}</h4>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Score (+4 / -1)</p>
                  <h4 style={{ fontSize: "2rem", fontWeight: "900" }}>{results.score} pts</h4>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>XP Earned</p>
                  <h4 style={{ fontSize: "2rem", fontWeight: "900", color: "#ffea00" }}>+{Math.max(0, results.score * 5)} XP</h4>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
