import React, { useEffect, useMemo, useState } from "react";
import { aptitudeQuestions, reasoningQuestions, verbalQuestions, technicalChallenges } from "../mockData";

const ASSESSMENT_STORAGE_KEY = "prepPlatformAssessmentResult";

type McqQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

const categories: Array<
  | { key: "aptitude" | "reasoning" | "verbal"; title: string; questions: McqQuestion[] }
  | { key: "technical"; title: "Technical"; questions: typeof technicalChallenges }
> = [
  { key: "aptitude", title: "Aptitude", questions: aptitudeQuestions as McqQuestion[] },
  { key: "reasoning", title: "Reasoning", questions: reasoningQuestions as McqQuestion[] },
  { key: "verbal", title: "Verbal", questions: verbalQuestions as McqQuestion[] },
  { key: "technical", title: "Technical", questions: technicalChallenges }
];

interface AnswerState {
  [key: string]: number | string;
}

export const PlacementAssessment: React.FC = () => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerState>({});
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState<string>(technicalChallenges[0].starterTemplate.javascript as string);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [showReport, setShowReport] = useState(false);
  const executionLanguages = ["javascript", "typescript", "python", "cpp", "java", "csharp", "go", "sql"];

  const currentCategory = categories[currentCategoryIndex];
  const isTechnical = currentCategory.key === "technical";

  const progress = useMemo(() => {
    return ((currentCategoryIndex + 1) / categories.length) * 100;
  }, [currentCategoryIndex]);

  const handleOptionSelect = (questionId: string, selectedIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: selectedIndex }));
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      if (categories[currentCategoryIndex + 1].key === "technical") {
        setCode(technicalChallenges[0].starterTemplate[language] || technicalChallenges[0].starterTemplate.javascript);
      }
      return;
    }

    setShowReport(true);
  };

  const handleLanguageChange = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    const template = technicalChallenges[0].starterTemplate[nextLanguage] || technicalChallenges[0].starterTemplate.javascript;
    setCode(String(template));
  };

  const runCodeTests = () => {
    if (language !== "javascript" && language !== "typescript") {
      setTestResults([{ passed: false, message: `Template loaded for ${language}. Browser-based test execution is enabled for JavaScript and TypeScript; other languages are included for coding practice and interview preparation.` }]);
      return;
    }

    const challenge = technicalChallenges[0];
    const safeCode = code.replace(/\s+/g, " ");
    if (!safeCode || safeCode.length < 20) {
      setTestResults([{ passed: false, message: "Code is too short to evaluate." }]);
      return;
    }

    try {
      const runFunction = new Function(
        `const module = { exports: {} }; const exports = module.exports; ${code}; return ${challenge.functionName};`
      );

      const fn = runFunction();
      const results = challenge.tests.map((test) => {
        const output = fn(test.input);
        const passed = output === test.expected;
        return {
          passed,
          message: passed ? `Passed for input ${test.input}` : `Failed for input ${test.input}: expected ${test.expected}, got ${output}`
        };
      });

      setTestResults(results);
    } catch (error) {
      setTestResults([{ passed: false, message: `Code execution error: ${error instanceof Error ? error.message : "Unknown error"}` }]);
    }
  };

  const report = useMemo(() => {
    const categoryScores: Record<string, number> = {};
    const weakAreas: string[] = [];

    categories.forEach((category) => {
      if (category.key === "technical") {
        const passed = testResults.filter((r) => r.passed).length;
        const score = Math.round((passed / Math.max(testResults.length, 1)) * 100);
        categoryScores[category.key] = score;
        if (score < 60) weakAreas.push("Technical Coding");
        return;
      }

      const relevantQuestions = category.questions as McqQuestion[];
      let correct = 0;
      relevantQuestions.forEach((question) => {
        const userAnswer = selectedAnswers[question.id];
        if (typeof userAnswer === "number" && userAnswer === question.correctIndex) {
          correct += 1;
        }
      });

      const score = Math.round((correct / relevantQuestions.length) * 100);
      categoryScores[category.key] = score;
      if (score < 60) weakAreas.push(category.title);
    });

    const bestDomain = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0];
    return {
      categoryScores,
      weakAreas: weakAreas.length ? weakAreas : ["General Speed & Accuracy"],
      bestDomain: bestDomain ? bestDomain[0] : "General"
    };
  }, [selectedAnswers, testResults]);

  useEffect(() => {
    if (!showReport) return;

    const generateAdvice = () => {
      const advice: string[] = [];

      if (report.weakAreas.includes("Aptitude")) {
        advice.push("Revise percentages, ratio-proportion, time and work, and simple interest. Practice 15 timed aptitude questions daily.");
      }
      if (report.weakAreas.includes("Reasoning")) {
        advice.push("Work on number series, seating arrangements, coding-decoding, and blood-relation puzzles. Solve 10 reasoning questions every day.");
      }
      if (report.weakAreas.includes("Verbal")) {
        advice.push("Improve grammar, vocabulary, and sentence correction. Read editorials and practice one paragraph-writing drill daily.");
      }
      if (report.weakAreas.includes("Technical Coding")) {
        advice.push("Revise arrays, strings, loops, recursion, and common DSA patterns. Practice 2 coding problems daily and explain your approach aloud.");
      }
      if (report.weakAreas.includes("General Speed & Accuracy")) {
        advice.push("Improve time management by working on mock tests and reviewing errors after each attempt.");
      }

      return advice;
    };

    const summary = {
      generatedAt: Date.now(),
      bestDomain: report.bestDomain,
      weakAreas: report.weakAreas,
      categoryScores: report.categoryScores,
      advice: generateAdvice(),
    };

    try {
      localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(summary));
    } catch (error) {
      console.warn("Unable to save assessment summary:", error);
    }
  }, [showReport, report]);

  if (showReport) {
    return (
      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="glass-panel" style={{ padding: "28px" }}>
          <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "900" }}>AI Performance Analysis</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "10px" }}>
            Based on your placement assessment, here is your improvement summary.
          </p>
        </div>

        <div className="display-grid grid-cols-2">
          {categories.map((category) => (
            <div key={category.key} className="glass-panel" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <strong>{category.title}</strong>
                <span>{report.categoryScores[category.key] ?? 0}%</span>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${report.categoryScores[category.key] ?? 0}%`, height: "100%", background: "linear-gradient(90deg, var(--primary-neon), var(--secondary-neon))" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ marginTop: 0 }}>Weak Areas</h3>
          <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: "1.8" }}>
            {report.weakAreas.map((area) => <li key={area}>{area}</li>)}
          </ul>

          <h3 style={{ marginTop: "20px" }}>Suggestions to Improve</h3>
          <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: "1.8" }}>
            {generateAdvice().map((tip, idx) => <li key={`${tip}-${idx}`}>{tip}</li>)}
          </ul>

          <h3 style={{ marginTop: "20px" }}>Strong Area</h3>
          <p style={{ margin: 0, color: "var(--text-primary)" }}>
            Your strongest domain appears to be <strong>{report.bestDomain}</strong>. Keep practicing with timed mock tests to maintain consistency.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="glass-panel" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Placement Assessment</p>
            <h2 style={{ margin: "6px 0 0", fontSize: "1.9rem", fontWeight: "900" }}>{currentCategory.title}</h2>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{currentCategoryIndex + 1} / {categories.length}</div>
        </div>
        <div style={{ marginTop: "14px", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--primary-neon), var(--secondary-neon))" }} />
        </div>
      </div>

      {isTechnical ? (
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ marginBottom: "18px" }}>
            <h3 style={{ margin: 0, marginBottom: "8px" }}>{technicalChallenges[0].title}</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>{technicalChallenges[0].description}</p>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
            <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} className="glass-input" style={{ minWidth: "190px" }}>
              {executionLanguages.map((item) => (
                <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
              ))}
            </select>
            <button className="glass-button primary" onClick={runCodeTests}>Run Test Cases</button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="glass-input"
            style={{ minHeight: "220px", fontFamily: "monospace", fontSize: "0.88rem" }}
          />

          <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {testResults.length > 0 ? testResults.map((result, index) => (
              <div key={index} className="glass-panel" style={{ padding: "12px 14px", borderColor: result.passed ? "rgba(0,255,150,0.2)" : "rgba(255,77,77,0.2)" }}>
                <strong style={{ color: result.passed ? "#7ef7c3" : "#ff8080" }}>{result.passed ? "Passed" : "Failed"}</strong>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>{result.message}</div>
              </div>
            )) : <p style={{ margin: 0, color: "var(--text-muted)" }}>Run the tests to validate your logic. JavaScript and TypeScript provide live execution in-browser; other languages act as templates for practice.</p>}
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {(currentCategory.questions as McqQuestion[]).map((question) => (
              <div key={question.id} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px" }}>
                <p style={{ margin: "0 0 12px", fontSize: "1rem", lineHeight: 1.7 }}>{question.question}</p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {question.options.map((option, index) => (
                    <label key={`${question.id}-${index}`} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name={String(question.id)}
                        checked={selectedAnswers[question.id] === index}
                        onChange={() => handleOptionSelect(String(question.id), index)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <button className="glass-button" onClick={() => setCurrentCategoryIndex((prev) => Math.max(0, prev - 1))} disabled={currentCategoryIndex === 0} style={{ opacity: currentCategoryIndex === 0 ? 0.5 : 1 }}>
          Previous Section
        </button>
        <button className="glass-button primary" onClick={handleNext}>
          {currentCategoryIndex === categories.length - 1 ? "Finish & Analyze" : "Next Section"}
        </button>
      </div>
    </div>
  );
};
