import React, { useState } from "react";
import { Trophy, Search } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  college: string;
  level: number;
  xp: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export const Leaderboard: React.FC = () => {
  const [filter, setFilter] = useState<"Global" | "College" | "Friends">("Global");
  const [search, setSearch] = useState("");

  const mockUsers: { [key: string]: LeaderboardUser[] } = {
    Global: [
      { rank: 1, name: "Aarav Sharma", college: "IIT Bombay", level: 14, xp: 7200, badge: "Algorithm God" },
      { rank: 2, name: "Prisha Patel", college: "BITS Pilani", level: 12, xp: 6100, badge: "Bug Hunter" },
      { rank: 3, name: "Kabir Singh", college: "DTU Delhi", level: 11, xp: 5800, badge: "System Architect" },
      { rank: 4, name: "Ananya Rao", college: "IIT Madras", level: 10, xp: 5120, isCurrentUser: true },
      { rank: 5, name: "Ishaan Verma", college: "VIT Vellore", level: 9, xp: 4800 },
      { rank: 6, name: "Diya Iyer", college: "NIT Trichy", level: 8, xp: 4200 }
    ],
    College: [
      { rank: 1, name: "Ananya Rao", college: "IIT Madras", level: 10, xp: 5120, isCurrentUser: true },
      { rank: 2, name: "Rohan Das", college: "IIT Madras", level: 9, xp: 4550 },
      { rank: 3, name: "Siddharth Sen", college: "IIT Madras", level: 8, xp: 4100 },
      { rank: 4, name: "Meera Nair", college: "IIT Madras", level: 7, xp: 3500 }
    ],
    Friends: [
      { rank: 1, name: "Prisha Patel", college: "BITS Pilani", level: 12, xp: 6100, badge: "Bug Hunter" },
      { rank: 2, name: "Ananya Rao", college: "IIT Madras", level: 10, xp: 5120, isCurrentUser: true },
      { rank: 3, name: "Siddharth Sen", college: "IIT Madras", level: 8, xp: 4100 },
      { rank: 4, name: "Varun Malhotra", college: "DTU Delhi", level: 6, xp: 2900 }
    ]
  };

  const currentList = mockUsers[filter].filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Leaderboard Rankings</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          Compare performance against friends, college peers, or engineering students globally.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Filters and search bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {["Global", "College", "Friends"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`glass-button ${filter === tab ? "active" : ""}`}
                style={{ fontSize: "0.85rem", padding: "6px 14px" }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", width: "220px" }}>
            <Search size={14} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: "30px", fontSize: "0.8rem", padding: "8px 12px 8px 30px" }}
            />
          </div>
        </div>

        {/* Podium visualization for top 3 */}
        {search === "" && filter === "Global" && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "24px", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
            
            {/* Rank 2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)", fontSize: "0.95rem", fontWeight: "bold" }}>2</div>
              <div className="glass-panel" style={{ width: "120px", height: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.08)" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Prisha Patel</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>6.1k XP</p>
              </div>
            </div>

            {/* Rank 1 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <Trophy size={28} color="#ffea00" style={{ filter: "drop-shadow(0 0 10px rgba(255,234,0,0.4))" }} />
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,234,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #ffea00", fontSize: "1.1rem", fontWeight: "bold" }}>1</div>
              <div className="glass-panel" style={{ width: "140px", height: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0, 229, 255, 0.05)", borderColor: "var(--primary-neon)", boxShadow: "0 0 15px rgba(0,229,255,0.15)" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--primary-neon)" }}>Aarav Sharma</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>7.2k XP</p>
              </div>
            </div>

            {/* Rank 3 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)", fontSize: "0.95rem", fontWeight: "bold" }}>3</div>
              <div className="glass-panel" style={{ width: "120px", height: "70px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.08)" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Kabir Singh</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>5.8k XP</p>
              </div>
            </div>

          </div>
        )}

        {/* Leaderboard list table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {currentList.map((user) => (
            <div
              key={user.rank}
              className="glass-panel"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderColor: user.isCurrentUser ? "var(--primary-neon)" : "var(--card-border)",
                background: user.isCurrentUser ? "rgba(0, 229, 255, 0.03)" : "rgba(13, 13, 26, 0.25)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span 
                  style={{ 
                    fontSize: "1.1rem", 
                    fontWeight: "800", 
                    color: user.rank === 1 ? "#ffea00" : user.rank === 2 ? "#e2e8f0" : user.rank === 3 ? "#cd7f32" : "var(--text-muted)",
                    width: "24px"
                  }}
                >
                  #{user.rank}
                </span>

                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{user.name}</span>
                    {user.isCurrentUser && (
                      <span style={{ fontSize: "0.65rem", background: "var(--primary-neon)", color: "#03030b", padding: "1px 6px", borderRadius: "8px", fontWeight: "bold" }}>YOU</span>
                    )}
                    {user.badge && (
                      <span style={{ fontSize: "0.65rem", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)", padding: "1px 6px", borderRadius: "8px", color: "var(--text-secondary)" }}>🛡 {user.badge}</span>
                    )}
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{user.college}</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Level {user.level}</p>
                  <p style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--primary-neon)", fontFamily: "var(--font-mono)" }}>{user.xp} XP</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
