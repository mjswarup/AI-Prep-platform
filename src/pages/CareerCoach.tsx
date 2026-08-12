import { useEffect, useMemo, useState, type FC, type FormEvent } from "react";
import { BrainCircuit, Sparkles, Target, BookOpenCheck, Send, AlertTriangle } from "lucide-react";
import { careerCoachRequest } from "../api/careerCoach";
import { mockCareerCoachResponses } from "../mockData";

interface Message {
  id: string;
  sender: "Coach" | "User";
  text: string;
}

interface AssessmentSummary {
  generatedAt: number;
  bestDomain: string;
  weakAreas: string[];
  categoryScores: Record<string, number>;
  advice: string[];
}

const MEMORY_KEY = "prepPlatformCoachMemory";
const ASSESSMENT_RESULT_KEY = "prepPlatformAssessmentResult";

const systemPrompt = "You are a helpful Prep Platform Coach for students using this exam preparation and placement platform. Your role is to guide users on exam preparation, concept revision, mock practice, doubt clarification, revision planning, interview readiness, resume improvements, and placement strategy. Stay focused on the platform experience and student learning flow. Keep your answers concise, practical, and encouraging. Do not answer unrelated general-purpose questions outside study, exam prep, interview readiness, professional growth, or placement support.";

function getAssessmentContext(): AssessmentSummary | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(ASSESSMENT_RESULT_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AssessmentSummary;
  } catch (error) {
    console.warn("Unable to parse assessment summary:", error);
    return null;
  }
}

function getMemorySummary(messages: Message[]) {
  const userMessages = messages.filter((m) => m.sender === "User");
  if (!userMessages.length) {
    return "This student has just started using the platform and has not asked any study questions yet.";
  }

  const recentTopics = userMessages.slice(-3).map((message) => message.text.trim()).join("; ");
  return `Recent study questions: ${recentTopics}`;
}

function buildStudyPlanResponse(userText: string, assessment: AssessmentSummary | null, recentMemory: string): string {
  const lowerText = userText.toLowerCase();
  const weakAreas = assessment?.weakAreas ?? [];
  const scoreMap = assessment?.categoryScores ?? {};

  if (lowerText.includes("aptitude") || lowerText.includes("applitude") || lowerText.includes("quant") || lowerText.includes("best suggestion") || lowerText.includes("good at")) {
    const aptitudeGuidance = `To get strong at aptitude, build a steady routine: focus first on core question types like number systems, arithmetic, algebra, logical reasoning, and data interpretation. Solve a few targeted questions daily, review every mistake immediately, and use timed mini-mocks to build speed and confidence. Tie the practice back to your platform workflow by filtering by the same topic areas and revisiting them after each mock.`;

    if (assessment && weakAreas.length > 0) {
      const weakAreaText = weakAreas.join(", ");
      const bestDomain = assessment.bestDomain || "General performance";
      const scoreSummary = Object.entries(scoreMap)
        .map(([key, value]) => `${key}: ${value}%`)
        .join(" | ");

      return `Your current profile shows ${scoreSummary}. The weakest topics are ${weakAreaText}, while ${bestDomain} is your strongest area. ${aptitudeGuidance} Start with the weakest topic, then circle back after each short mock to review mistakes and strengthen recall.`;
    }

    return aptitudeGuidance;
  }

  if (assessment && weakAreas.length > 0) {
    const weakAreaText = weakAreas.join(", ");
    const bestDomain = assessment.bestDomain || "General performance";

    if (lowerText.includes("next step") || lowerText.includes("plan") || lowerText.includes("study") || lowerText.includes("improve") || lowerText.includes("weak")) {
      const scoreSummary = Object.entries(scoreMap)
        .map(([key, value]) => `${key}: ${value}%`)
        .join(" | ");

      return `Based on your latest assessment, your current score profile is: ${scoreSummary}. Your weakest areas are ${weakAreaText}. Your strongest area is ${bestDomain}. My recommended study plan: 1) spend 30 minutes on the weakest section first, 2) do 10 targeted practice questions in that area, 3) revise mistakes for 15 minutes, and 4) complete one mixed mock after each session. This keeps your prep focused on the platform sections most likely to improve your placement score.`;
    }

    if (lowerText.includes("doubt") || lowerText.includes("confused") || lowerText.includes("help")) {
      return `From your assessment, ${weakAreaText} needs the most attention. Start with a focused drill: 5 questions from the weakest topic, review each mistake, then attempt a short mixed test. Keep revision tied to your platform sections and avoid broad, unfocused study.`;
    }
  }

  for (const item of mockCareerCoachResponses) {
    if (item.keywords.some((keyword) => lowerText.includes(keyword))) {
      return item.response;
    }
  }

  return `I can help with your platform-specific prep plan. Based on your recent study flow, focus on one weak section, do targeted practice, review mistakes, and then attempt a shorter mixed mock. ${recentMemory}`;
}

function getMockResponse(userText: string, assessment: AssessmentSummary | null, recentMemory: string): string {
  return buildStudyPlanResponse(userText, assessment, recentMemory);
}

export const CareerCoach: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-coach",
      sender: "Coach",
      text: "Hello! I’m your prep coach. Ask about revision plans, weak areas, mock test strategy, or doubts in your platform assessment flow.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentSummary | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MEMORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.warn("Unable to restore coach memory:", error);
    }

    setAssessment(getAssessmentContext());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn("Unable to save coach memory:", error);
    }
  }, [messages]);

  useEffect(() => {
    const summary = getAssessmentContext();
    if (summary) {
      setAssessment(summary);
    }
  }, [messages]);

  const recentMemory = useMemo(() => getMemorySummary(messages), [messages]);
  const showApiWarning = true;

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newUserMessage = { id: `msg-user-${Date.now()}-${Math.random()}`, sender: "User" as const, text: userText };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setInput("");
    setIsLoading(true);

    try {
      let coachResponse: string;

      try {
        const response = await careerCoachRequest([
          { role: "system", content: systemPrompt },
          { role: "user", content: `${userText}\n\nStudent memory: ${recentMemory}\n\nAssessment context: ${assessment ? JSON.stringify(assessment) : "No assessment yet"}` },
        ]);
        coachResponse = response.choices[0]?.message?.content || getMockResponse(userText, assessment, recentMemory);
      } catch (apiError) {
        console.warn("Backend API call failed, using guided response:", apiError);
        coachResponse = getMockResponse(userText, assessment, recentMemory);
      }

      setMessages((prev) => [
        ...prev,
        { id: `msg-coach-${Date.now()}-${Math.random()}`, sender: "Coach" as const, text: coachResponse },
      ]);
    } catch (error) {
      console.error("Error in handleSend:", error);
      const errorMessage = error instanceof Error ? error.message : "Sorry, I’m having trouble responding. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-coach-error-${Date.now()}`,
          sender: "Coach" as const,
          text: `Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "Based on my score, what should I do next for my weak areas?",
    "I am weak in DSA. Give me a study plan for the next 7 days.",
    "Help me revise verbal and technical practice together.",
    "Explain what I should focus on after taking the placement assessment."
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.5s ease-out" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: "1.9rem", fontWeight: "900", margin: 0 }}>Prep Coach</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
            Platform-specific guidance for revision, doubts, assessment follow-up, and placement readiness.
          </p>
        </div>

        <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "12px" }}>
          <BrainCircuit size={16} color="var(--primary-neon)" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            {assessment ? `Weak areas: ${assessment.weakAreas.join(", ") || "General review"}` : "Assessment not attempted yet"}
          </span>
        </div>
      </div>

      {showApiWarning && (
        <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(0, 229, 255, 0.08)", border: "1px solid rgba(0, 229, 255, 0.18)", display: "flex", alignItems: "center", gap: "12px" }}>
          <AlertTriangle size={18} color="var(--primary-neon)" style={{ flexShrink: 0 }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>
            Live AI coaching needs the backend service. Until then, the coach uses platform-specific guidance based on your assessment and recent study flow.
          </p>
        </div>
      )}

      <div className="display-grid grid-cols-3" style={{ gridTemplateColumns: "0.9fr 2.1fr", alignItems: "stretch", gap: "20px" }}>
        <div className="glass-panel" style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(189,0,255,0.18))", display: "grid", placeItems: "center" }}>
              <Target size={18} color="var(--primary-neon)" />
            </div>
            <h4 style={{ fontSize: "1rem", fontWeight: "700", margin: 0 }}>Recommended Queries</h4>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.025)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.82rem",
                  lineHeight: "1.5",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.5)";
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <BookOpenCheck size={16} color="var(--secondary-neon)" />
              <strong style={{ fontSize: "0.8rem" }}>Study memory</strong>
            </div>
            <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.75rem", lineHeight: "1.5" }}>{recentMemory}</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "22px", display: "flex", flexDirection: "column", height: "560px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(189,0,255,0.2))", display: "grid", placeItems: "center" }}>
                <Sparkles size={15} color="var(--primary-neon)" />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>Prep Coach Chat</span>
            </div>
          </div>

          <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingRight: "8px", marginBottom: "16px" }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === "Coach" ? "flex-start" : "flex-end",
                  maxWidth: "82%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.sender === "Coach" ? "flex-start" : "flex-end",
                }}
              >
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "14px",
                    borderTopLeftRadius: m.sender === "Coach" ? "6px" : "14px",
                    borderTopRightRadius: m.sender === "User" ? "6px" : "14px",
                    background: m.sender === "Coach" ? "rgba(255,255,255,0.025)" : "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(189,0,255,0.2))",
                    border: "1px solid",
                    borderColor: m.sender === "Coach" ? "rgba(255,255,255,0.08)" : "rgba(0,229,255,0.18)",
                    color: "var(--text-primary)",
                    fontSize: "0.84rem",
                    lineHeight: "1.55",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {m.sender === "Coach" ? "Coach" : "You"}
                </span>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: "flex-start", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                Coach is reviewing your prep plan...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ display: "flex", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", opacity: isLoading ? 0.55 : 1 }}>
            <input
              type="text"
              placeholder="Ask about mock tests, weak areas, revision plan, or interview prep..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="glass-input"
              style={{ fontSize: "0.84rem", flex: 1 }}
              disabled={isLoading}
            />
            <button type="submit" className="glass-button primary" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }} disabled={isLoading}>
              <Send size={14} fill="#03030b" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
