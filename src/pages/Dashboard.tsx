import React from "react";
import { Flame, Target, CheckCircle2, Sparkles, Trophy, Calendar } from "lucide-react";

interface DashboardProps {
  user: {
    name: string;
    college: string;
    branch: string;
    streak: number;
    dreamCompanies: string[];
    xp: number;
    level: number;
  };
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  // Scores representing user profile strength
  const scores = [
    { label: "CRT Score", value: 78, color: "var(--primary-neon)" },
    { label: "Coding Score", value: 65, color: "var(--secondary-neon)" },
    { label: "Interview Score", value: 82, color: "var(--accent-pink)" },
    { label: "Resume Score", value: 74, color: "#ffea00" },
  ];



  // Mock placement calendar data
  const placementDrives = [
    { company: "Amazon", role: "SDE-1", date: "July 12, 2026", status: "Open" },
    { company: "Deloitte", role: "Analyst", date: "July 18, 2026", status: "Registered" },
    { company: "Microsoft", role: "Software Engineer", date: "Aug 02, 2026", status: "Closing Soon" },
  ];

  // Daily goals list
  const dailyGoals = [
    { task: "Complete Quantitative Aptitude test", xp: 100, completed: true },
    { task: "Solve 1 Medium difficulty Coding Challenge", xp: 150, completed: false },
    { task: "Attempt Amazon Mock Interview simulation", xp: 200, completed: false },
  ];

  // SVG Line Chart coordinates calculation for 7 days
  const weeklyData = [40, 50, 45, 68, 60, 75, 82]; // Mon - Sun scores
  const chartHeight = 120;
  const chartWidth = 450;
  const points = weeklyData.map((val, idx) => {
    const x = (idx * (chartWidth - 40)) / 6 + 20;
    const y = chartHeight - (val / 100) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  }).join(" ");

  // Heatmap helper (last 12 weeks: 12 cols * 7 rows)
  const heatmapGrid = Array.from({ length: 84 }, (_, idx) => {
    // Generate mock commit levels (0: none, 1: low, 2: mid, 3: high)
    const weights = [0, 0, 1, 0, 2, 0, 3, 1, 2, 0, 1, 2, 3, 0];
    return {
      id: `heatmap-cell-${idx}`,
      weight: weights[idx % weights.length]
    };
  });

  const getHeatmapColor = (weight: number) => {
    if (weight === 0) return "rgba(255,255,255,0.03)";
    if (weight === 1) return "rgba(0, 229, 255, 0.2)";
    if (weight === 2) return "rgba(0, 229, 255, 0.5)";
    return "var(--primary-neon)";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      {/* Top Banner Row */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "28px", 
          background: "linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(189, 0, 255, 0.05))",
          borderColor: "rgba(0, 229, 255, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "4px" }}>
            Welcome back, <span className="gradient-text">{user.name}!</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {user.branch} • {user.college}
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            {user.dreamCompanies.map((c) => (
              <span 
                key={c}
                style={{ 
                  fontSize: "0.75rem", 
                  background: "rgba(255,255,255,0.04)", 
                  padding: "4px 10px", 
                  borderRadius: "12px", 
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--primary-neon)"
                }}
              >
                🎯 {c}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <div className="glass-panel" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,140,0,0.04)", borderColor: "rgba(255,140,0,0.15)" }}>
            <Flame size={28} color="#ff8c00" fill="#ff8c00" />
            <div>
              <p style={{ fontSize: "1.2rem", fontWeight: "900", color: "#ff8c00", lineHeight: "1" }}>{user.streak}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>Daily Streak</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", background: "rgba(0,229,255,0.04)", borderColor: "rgba(0,229,255,0.15)" }}>
            <Trophy size={28} color="var(--primary-neon)" />
            <div>
              <p style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--primary-neon)", lineHeight: "1" }}>Lvl {user.level}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{user.xp} Total XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="display-grid grid-cols-4">
        {scores.map((score) => (
          <div key={score.label} className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>{score.label}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Target: 85%+</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <h3 style={{ fontSize: "2.2rem", fontWeight: "900", color: score.color, lineHeight: "1" }}>{score.value}%</h3>
              
              {/* Custom SVG spark progress */}
              <svg width="60" height="24" viewBox="0 0 60 24" style={{ marginBottom: "4px" }}>
                <path 
                  d={`M0 24 Q15 ${24 - score.value * 0.2} 30 ${24 - score.value * 0.22} T60 ${24 - score.value * 0.24}`}
                  fill="none" 
                  stroke={score.color} 
                  strokeWidth="2" 
                />
              </svg>
            </div>
            
            {/* Visual Indicator Progress bar */}
            <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: `${score.value}%`, height: "100%", backgroundColor: score.color, borderRadius: "2px" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Performance Split Row */}
      <div className="display-grid grid-cols-3" style={{ gridTemplateColumns: "2fr 1fr" }}>
        
        {/* Weekly Analytics & Activity Map */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Weekly growth SVG graph */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Weekly Prep Performance</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--primary-neon)", fontWeight: "600" }}>+12% vs Last Week</span>
            </div>

            <div style={{ position: "relative", width: "100%", height: `${chartHeight}px` }}>
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="line-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-neon)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--primary-neon)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="20" y1="15" x2={chartWidth - 20} y2="15" stroke="rgba(255,255,255,0.05)" />
                <line x1="20" y1="55" x2={chartWidth - 20} y2="55" stroke="rgba(255,255,255,0.05)" />
                <line x1="20" y1="95" x2={chartWidth - 20} y2="95" stroke="rgba(255,255,255,0.05)" />

                {/* Chart path area & stroke */}
                <path 
                  d={`M20,${chartHeight - 15} L${points} L${chartWidth - 20},${chartHeight - 15} Z`} 
                  fill="url(#line-glow)" 
                />
                <polyline 
                  fill="none" 
                  stroke="var(--primary-neon)" 
                  strokeWidth="3" 
                  points={points} 
                />

                {/* Interactive markers */}
                {weeklyData.map((val, idx) => {
                  const x = (idx * (chartWidth - 40)) / 6 + 20;
                  const y = chartHeight - (val / 100) * (chartHeight - 30) - 15;
                  return (
                    <circle 
                      key={x} 
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="#03030b" 
                      stroke="var(--primary-neon)" 
                      strokeWidth="2.5" 
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* Days labels */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Activity Heatmap Grid */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Preparation Heatmap</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(12, 1fr)", 
                  gap: "5px",
                  overflowX: "auto"
                }}
              >
                {heatmapGrid.map((cell) => (
                  <div 
                    key={cell.id}
                    title={`Day activity level: ${cell.weight}`}
                    style={{ 
                      aspectRatio: "1/1", 
                      borderRadius: "3px", 
                      backgroundColor: getHeatmapColor(cell.weight),
                      transition: "transform 0.15s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                <span>Last 12 Weeks Activity</span>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span>Less</span>
                  <div style={{ width: "8px", height: "8px", borderRadius: "1px", backgroundColor: "rgba(255,255,255,0.03)" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "1px", backgroundColor: "rgba(0, 229, 255, 0.2)" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "1px", backgroundColor: "rgba(0, 229, 255, 0.5)" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "1px", backgroundColor: "var(--primary-neon)" }} />
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goals & Driving schedule */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Daily Goals Panel */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Target size={18} color="var(--primary-neon)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700" }}>Daily Goals</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {dailyGoals.map((goal) => (
                <div 
                  key={goal.task}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    padding: "10px", 
                    borderRadius: "8px", 
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid rgba(255,255,255,0.04)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", maxWidth: "80%" }}>
                    <CheckCircle2 size={16} color={goal.completed ? "var(--primary-neon)" : "var(--text-muted)"} />
                    <span style={{ fontSize: "0.8rem", color: goal.completed ? "var(--text-muted)" : "var(--text-primary)", textDecoration: goal.completed ? "line-through" : "none" }}>{goal.task}</span>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--primary-neon)", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>+{goal.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Placement drives list */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Calendar size={18} color="var(--secondary-neon)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700" }}>Placement Drive Openings</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {placementDrives.map((drive) => (
                <div 
                  key={`${drive.company}-${drive.role}`} 
                  style={{ 
                    padding: "12px", 
                    borderRadius: "10px", 
                    background: "rgba(255,255,255,0.02)", 
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: "700" }}>{drive.company}</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{drive.role} • {drive.date}</p>
                  </div>
                  <span 
                    style={{ 
                      fontSize: "0.7rem", 
                      padding: "4px 8px", 
                      borderRadius: "6px", 
                      background: drive.status === "Open" ? "rgba(0,229,255,0.1)" : drive.status === "Registered" ? "rgba(189,0,255,0.1)" : "rgba(255,0,127,0.1)",
                      color: drive.status === "Open" ? "var(--primary-neon)" : drive.status === "Registered" ? "var(--secondary-neon)" : "var(--accent-pink)",
                      fontWeight: "bold"
                    }}
                  >
                    {drive.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* AI Recommendations panel */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "24px", 
          background: "linear-gradient(135deg, rgba(189,0,255,0.03), rgba(0,229,255,0.03))",
          borderColor: "var(--card-border)",
          display: "flex",
          gap: "20px",
          alignItems: "center"
        }}
      >
        <div 
          style={{ 
            width: "48px", 
            height: "48px", 
            borderRadius: "50%", 
            background: "rgba(0, 229, 255, 0.1)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            flexShrink: 0 
          }}
        >
          <Sparkles size={24} color="var(--primary-neon)" />
        </div>
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Personalized AI Assistant Recommendations</span>
            <span style={{ fontSize: "0.7rem", background: "var(--primary-neon)", color: "#03030b", padding: "1px 6px", borderRadius: "8px", fontWeight: "bold" }}>ADAPTIVE</span>
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.4" }}>
            Based on your focus for <strong style={{ color: "var(--primary-neon)" }}>{user.dreamCompanies[0]}</strong>, you should strengthen your <strong>Coding score (currently 65%)</strong> by solving graphs and tree-based problems. We suggest attempting our <strong>Two Sum coding challenge</strong> and starting a <strong>Technical voice interview simulation</strong>.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button onClick={() => onNavigate("coding")} className="glass-button" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>Practice DSA</button>
            <button onClick={() => onNavigate("interview")} className="glass-button" style={{ padding: "6px 12px", fontSize: "0.75rem", borderColor: "var(--primary-neon)" }}>Simulate Interview</button>
          </div>
        </div>
      </div>
    </div>
  );
};
