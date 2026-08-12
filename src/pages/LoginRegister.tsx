import React, { useState } from "react";
import { LogIn, UserPlus, ArrowRight, ArrowLeft } from "lucide-react";

interface LoginRegisterProps {
  onSuccess: (userData: { name: string; college: string; branch: string; gradYear: string; dreamCompanies: string[]; email?: string; isAdmin?: boolean }) => void;
  onBackToHome: () => void;
}

export const LoginRegister: React.FC<LoginRegisterProps> = ({ onSuccess, onBackToHome }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1); // For registration steps
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const ADMIN_EMAIL = "manukondajswaroop@gmail.com";

  // Registration states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCollege, setRegCollege] = useState("");
  const [regBranch, setRegBranch] = useState("");
  const [regGradYear, setRegGradYear] = useState("2027");
  const [regSkills, setRegSkills] = useState("");

  const [dreamCompanies, setDreamCompanies] = useState<string[]>([]);
  const [preferredDomain, setPreferredDomain] = useState("Software Engineering");

  const companyList = ["Google", "Amazon", "Microsoft", "TCS", "Accenture", "Deloitte", "Infosys", "Nvidia"];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setLoginError(data?.error?.message || "Login failed. Please try again.");
        return;
      }

      const user = data.user;
      onSuccess({
        name: user.name,
        college: user.college,
        branch: user.branch,
        gradYear: user.gradYear,
        dreamCompanies: user.dreamCompanies || ["Google", "Amazon"],
        email: user.email,
        isAdmin: Boolean(user.isAdmin),
      });
    } catch (error) {
      setLoginError("Unable to reach the server. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!regName || !regEmail || !regPassword || !regCollege) {
      setRegisterError("Name, email, password, and college are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail.trim(),
          password: regPassword,
          college: regCollege,
          branch: regBranch || "Information Technology",
          gradYear: regGradYear,
          dreamCompanies: dreamCompanies.length > 0 ? dreamCompanies : ["Amazon", "Google"],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setRegisterError(data?.error?.message || "Registration failed. Please try again.");
        return;
      }

      const user = data.user;
      onSuccess({
        name: user.name,
        college: user.college,
        branch: user.branch,
        gradYear: user.gradYear,
        dreamCompanies: user.dreamCompanies || ["Google", "Amazon"],
        email: user.email,
        isAdmin: Boolean(user.isAdmin),
      });
    } catch (error) {
      setRegisterError("Unable to reach the server. Please try again later.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompany = (company: string) => {
    if (dreamCompanies.includes(company)) {
      setDreamCompanies(dreamCompanies.filter((c) => c !== company));
    } else {
      setDreamCompanies([...dreamCompanies, company]);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "40px 24px" }}>
      <div 
        className="glass-panel" 
        style={{ 
          width: "100%", 
          maxWidth: "480px", 
          padding: "36px", 
          position: "relative",
          animation: "fadeIn 0.5s ease-out"
        }}
      >
        <button 
          onClick={onBackToHome}
          style={{ 
            position: "absolute", 
            top: "16px", 
            left: "16px", 
            background: "none", 
            border: "none", 
            color: "var(--text-secondary)", 
            cursor: "pointer",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        {!isRegistering ? (
          /* LOGIN FORM */
          <div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "8px", textAlign: "center" }}>
              Welcome <span className="gradient-text">Back</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center", marginBottom: "32px" }}>
              Log in to continue your placement journey
            </p>

            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Email Address</label>
                <input 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@college.edu" 
                  className="glass-input" 
                  required
                />
              </div>
              {loginEmail.trim().toLowerCase() === ADMIN_EMAIL && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderRadius: "12px", background: "rgba(0, 229, 255, 0.08)", color: "var(--text-primary)", border: "1px solid rgba(0, 229, 255, 0.15)" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>Admin email recognized</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Enter the admin password to unlock admin access.</span>
                </div>
              )}

              <div>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Password</label>
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="glass-input" 
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--text-secondary)" }}>
                  <input type="checkbox" style={{ accentColor: "var(--primary-neon)" }} /> Remember me
                </label>
                <a style={{ color: "var(--primary-neon)", textDecoration: "none", cursor: "pointer" }}>Forgot Password?</a>
              </div>

              <button type="submit" className="glass-button primary" style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: "8px" }} disabled={isLoading}>
                <LogIn size={16} fill="#03030b" />
                <span>{isLoading ? "Signing in…" : "Sign In"}</span>
              </button>
            </form>
            {loginError && (
              <p style={{ color: "#ff7b7b", marginTop: "12px", textAlign: "center", fontSize: "0.9rem" }}>{loginError}</p>
            )}

            <div style={{ margin: "24px 0", textAlign: "center", position: "relative" }}>
              <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />
              <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#0a0a14", padding: "0 10px", fontSize: "0.75rem", color: "var(--text-muted)" }}>OR</span>
            </div>

            {/* Social Logins */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button type="button" onClick={() => alert("Social login is not supported in this version. Please login with email and password.")} className="glass-button" style={{ width: "100%", justifyContent: "center", background: "rgba(255,255,255,0.01)" }}>
                <span>Continue with Google</span>
              </button>
              <button type="button" onClick={() => alert("Social login is not supported in this version. Please login with email and password.")} className="glass-button" style={{ width: "100%", justifyContent: "center", background: "rgba(255,255,255,0.01)" }}>
                <span>Continue with Microsoft</span>
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "32px" }}>
              New here?{" "}
              <a 
                onClick={() => { setIsRegistering(true); setStep(1); }} 
                style={{ color: "var(--primary-neon)", cursor: "pointer", fontWeight: "600" }}
              >
                Create an Account
              </a>
            </p>
          </div>
        ) : (
          /* REGISTRATION MULTI-STEP */
          <div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "8px", textAlign: "center" }}>
              Register <span className="gradient-text">Account</span>
            </h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "24px" }}>
              <div style={{ width: "24px", height: "4px", borderRadius: "2px", background: step >= 1 ? "var(--primary-neon)" : "rgba(255,255,255,0.1)" }} />
              <div style={{ width: "24px", height: "4px", borderRadius: "2px", background: step >= 2 ? "var(--primary-neon)" : "rgba(255,255,255,0.1)" }} />
              <div style={{ width: "24px", height: "4px", borderRadius: "2px", background: step >= 3 ? "var(--primary-neon)" : "rgba(255,255,255,0.1)" }} />
            </div>

            <form onSubmit={handleRegisterSubmit}>
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Full Name</label>
                    <input 
                      type="text" 
                      value={regName} 
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe" 
                      className="glass-input" 
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Email</label>
                    <input 
                      type="email" 
                      value={regEmail} 
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="john@college.edu" 
                      className="glass-input" 
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Password</label>
                    <input 
                      type="password" 
                      value={regPassword} 
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="glass-input" 
                      required
                    />
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="glass-button primary" style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: "8px" }}>
                    <span>Next: Education</span>
                    <ArrowRight size={16} fill="#03030b" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>College/University</label>
                    <input 
                      type="text" 
                      value={regCollege} 
                      onChange={(e) => setRegCollege(e.target.value)}
                      placeholder="e.g. IIT Madras" 
                      className="glass-input" 
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Branch/Specialization</label>
                    <input 
                      type="text" 
                      value={regBranch} 
                      onChange={(e) => setRegBranch(e.target.value)}
                      placeholder="e.g. Computer Science" 
                      className="glass-input" 
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Graduation Year</label>
                    <select 
                      value={regGradYear} 
                      onChange={(e) => setRegGradYear(e.target.value)}
                      className="glass-input glass-select"
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" onClick={() => setStep(1)} className="glass-button" style={{ flex: 1, justifyContent: "center" }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="glass-button primary" style={{ flex: 1, justifyContent: "center" }}>
                      <span>Next: Skills</span>
                      <ArrowRight size={16} fill="#03030b" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Key Skills (comma separated)</label>
                    <input 
                      type="text" 
                      value={regSkills} 
                      onChange={(e) => setRegSkills(e.target.value)}
                      placeholder="React, SQL, Python" 
                      className="glass-input" 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Preferred Domain</label>
                    <select 
                      value={preferredDomain} 
                      onChange={(e) => setPreferredDomain(e.target.value)}
                      className="glass-input glass-select"
                    >
                      <option value="Software Engineering">Software Engineering (SDE)</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="AI Engineer">AI Engineer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>Dream Companies</label>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                      {companyList.map((company) => (
                        <button
                          key={company}
                          type="button"
                          onClick={() => toggleCompany(company)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "16px",
                            border: "1px solid",
                            borderColor: dreamCompanies.includes(company) ? "var(--primary-neon)" : "rgba(255,255,255,0.08)",
                            background: dreamCompanies.includes(company) ? "rgba(0, 229, 255, 0.15)" : "transparent",
                            color: dreamCompanies.includes(company) ? "var(--primary-neon)" : "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            transition: "all 0.2s"
                          }}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" onClick={() => setStep(2)} className="glass-button" style={{ flex: 1, justifyContent: "center" }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="submit" className="glass-button primary" style={{ flex: 1, justifyContent: "center" }} disabled={isLoading}>
                      <UserPlus size={16} fill="#03030b" />
                      <span>{isLoading ? "Registering…" : "Register"}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
            {registerError && (
              <p style={{ color: "#ff7b7b", marginTop: "12px", textAlign: "center", fontSize: "0.9rem" }}>{registerError}</p>
            )}

            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "32px" }}>
              Already registered?{" "}
              <a 
                onClick={() => setIsRegistering(false)} 
                style={{ color: "var(--primary-neon)", cursor: "pointer", fontWeight: "600" }}
              >
                Sign In
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
