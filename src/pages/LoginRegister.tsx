import React, { useState } from "react";
import { LogIn, ArrowLeft } from "lucide-react";

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
    <div className="login-page">
      <div className="login-page__background"></div>
      <div className="login-page__overlay"></div>

      <main className="login-page__content">
        {/* Intro section intentionally removed per design request */}

        <section className="glass-auth-card glass-panel">
          <button type="button" className="back-button" onClick={onBackToHome}>
            <ArrowLeft size={16} /> Back to Home
          </button>

          {!isRegistering ? (
            <div className="auth-section">
              <div className="auth-header">
                <div>
                  <p className="eyebrow">Welcome Back</p>
                  <h2>Sign in to continue</h2>
                </div>
                <span className="auth-badge">AI Mentor</span>
              </div>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="glass-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input"
                    required
                  />
                </div>

                <div className="auth-footer-row">
                  <label className="remember-me">
                    <input type="checkbox" /> Remember me
                  </label>
                  <button type="button" className="link-button">
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="glass-button primary auth-submit" disabled={isLoading}>
                  <LogIn size={16} />
                  <span>{isLoading ? "Signing in…" : "Login"}</span>
                </button>
              </form>

              {loginError && <p className="error-text">{loginError}</p>}

              <div className="login-divider">
                <span>OR</span>
              </div>

              <button type="button" className="glass-button social-btn">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                </svg>
                Continue with Google
              </button>

              <p className="switch-action">
                New here? <button type="button" className="link-button" onClick={() => { setIsRegistering(true); setStep(1); }}>Create an Account</button>
              </p>
            </div>
          ) : (
            <div className="auth-section">
              <div className="auth-header">
                <div>
                  <p className="eyebrow">Create Account</p>
                  <h2>Get started for free</h2>
                </div>
                <div className="progress-pill">Step {step} of 3</div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                {step === 1 && (
                  <>
                    <div className="form-field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="John Doe"
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Email</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="john@college.edu"
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Password</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="button-row">
                      <button type="button" className="glass-button" onClick={() => setIsRegistering(false)}>
                        Back
                      </button>
                      <button type="button" className="glass-button primary" onClick={() => setStep(2)}>
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="form-field">
                      <label>College / University</label>
                      <input
                        type="text"
                        value={regCollege}
                        onChange={(e) => setRegCollege(e.target.value)}
                        placeholder="e.g. IIT Madras"
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Branch / Specialization</label>
                      <input
                        type="text"
                        value={regBranch}
                        onChange={(e) => setRegBranch(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Graduation Year</label>
                      <select value={regGradYear} onChange={(e) => setRegGradYear(e.target.value)} className="glass-input glass-select">
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    </div>
                    <div className="button-row">
                      <button type="button" className="glass-button" onClick={() => setStep(1)}>
                        Back
                      </button>
                      <button type="button" className="glass-button primary" onClick={() => setStep(3)}>
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="form-field">
                      <label>Key Skills</label>
                      <input
                        type="text"
                        value={regSkills}
                        onChange={(e) => setRegSkills(e.target.value)}
                        placeholder="React, SQL, Python"
                        className="glass-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>Preferred Domain</label>
                      <select value={preferredDomain} onChange={(e) => setPreferredDomain(e.target.value)} className="glass-input glass-select">
                        <option value="Software Engineering">Software Engineering (SDE)</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="AI Engineer">AI Engineer</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Dream Companies</label>
                      <div className="company-chip-row">
                        {companyList.map((company) => (
                          <button
                            key={company}
                            type="button"
                            onClick={() => toggleCompany(company)}
                            className={dreamCompanies.includes(company) ? "company-chip active" : "company-chip"}
                          >
                            {company}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="button-row">
                      <button type="button" className="glass-button" onClick={() => setStep(2)}>
                        Back
                      </button>
                      <button type="submit" className="glass-button primary" disabled={isLoading}>
                        {isLoading ? "Registering…" : "Create Account"}
                      </button>
                    </div>
                  </>
                )}
              </form>

              {registerError && <p className="error-text">{registerError}</p>}

              <p className="switch-action">
                Already registered? <button type="button" className="link-button" onClick={() => setIsRegistering(false)}>Sign In</button>
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
