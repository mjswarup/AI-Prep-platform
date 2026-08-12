import { useEffect, useState, type FC } from "react";
import { UploadCloud, ArrowRight, RotateCcw, FolderOpen } from "lucide-react";

export const TestGenerator: FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(5);

  const loadFiles = async () => {
    try {
      const response = await fetch("/api/mock-papers");
      const data = await response.json();
      if (Array.isArray(data)) {
        setFiles(data);
        if (!selectedFile && data.length > 0) {
          setSelectedFile(data[0]);
        }
      }
    } catch (error) {
      console.warn("Unable to load uploaded papers:", error);
      setMessage("Unable to load uploaded paper list.");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/mock-papers/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error?.message || "Upload failed. Use PDF or DOCX.");
      } else {
        setMessage(`Uploaded file: ${result.originalname}`);
        await loadFiles();
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Unable to upload file. Please try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setMessage("Select an uploaded paper before generating a test.");
      return;
    }

    setMessage("");
    setQuestions([]);

    try {
      const response = await fetch("/api/mock-papers/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: selectedFile, count: questionCount }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error?.message || "Unable to generate questions from the selected file.");
      } else {
        setQuestions(result.questions || []);
        setMessage(result.message || "Generated questions based on the uploaded paper.");
      }
    } catch (error) {
      console.error("Generate error:", error);
      setMessage("Unable to generate the test. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.5s ease-out" }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Mock Paper Generator</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "6px" }}>
          Upload your PDF or DOCX mock test paper into the server folder, then generate a new practice test from the existing content.
        </p>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <UploadCloud size={20} color="var(--primary-neon)" />
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700" }}>Upload Mock Papers</h3>
              <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                Drop PDF or DOCX files here, or browse from your device. Uploaded files are saved in the backend `mock_papers/` folder.
              </p>
            </div>
          </div>

          <label
            htmlFor="mock-paper-upload"
            className="glass-button"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%" }}
          >
            <span>{uploading ? "Uploading..." : "Browse Papers"}</span>
          </label>
          <input
            id="mock-paper-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>Tip: You can also place files directly into the project folder <code>mock_papers/</code> on the server and refresh the file list.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FolderOpen size={20} color="var(--secondary-neon)" />
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700" }}>Uploaded Papers</h3>
              <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                Select the file to generate a new test from its content.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {files.length > 0 ? (
              files.map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className="glass-button"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "left",
                    borderColor: selectedFile === file ? "var(--primary-neon)" : "rgba(255,255,255,0.08)",
                    background: selectedFile === file ? "rgba(0,229,255,0.08)" : "rgba(255,255,255,0.02)",
                    color: selectedFile === file ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file}</span>
                  <ArrowRight size={16} />
                </button>
              ))
            ) : (
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>No uploaded mock papers found yet.</p>
            )}
          </div>

          <button
            onClick={loadFiles}
            className="glass-button"
            style={{ alignSelf: "flex-start", width: "auto" }}
          >
            <RotateCcw size={16} /> Refresh list
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", display: "grid", gap: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700" }}>Generate New Test</h3>
            <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              Use the selected uploaded paper to create a new set of practice questions.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="number"
              min={1}
              max={20}
              value={questionCount}
              onChange={(event) => setQuestionCount(Number(event.target.value))}
              className="glass-input"
              style={{ width: "100px" }}
            />
            <button className="glass-button primary" onClick={handleGenerate} disabled={!selectedFile}>
              Generate Questions
            </button>
          </div>
        </div>

        {message && (
          <div style={{ color: "var(--text-primary)", fontSize: "0.9rem", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {message}
          </div>
        )}

        {questions.length > 0 && (
          <div style={{ display: "grid", gap: "12px" }}>
            {questions.map((question, index) => (
              <div key={index} className="glass-panel" style={{ padding: "18px" }}>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  <strong>Q{index + 1}.</strong> {question}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: "20px" }}>
        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700" }}>Mobile friendly usage</h4>
        <p style={{ marginTop: "10px", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
          This page is built responsively so you can access it from mobile screens. Upload papers from your phone browser, refresh the list, then generate a new test based on the selected mock paper.
        </p>
      </div>
    </div>
  );
};
