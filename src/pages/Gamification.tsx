import React, { useState } from "react";
import { SpinWheel } from "../components/SpinWheel";
import { Award, Star, Flame, Zap, Shield } from "lucide-react";

interface GamificationProps {
  user: {
    xp: number;
    level: number;
    streak: number;
  };
  onGainXp: (xp: number) => void;
}

export const Gamification: React.FC<GamificationProps> = ({ user, onGainXp }) => {
  const [coins, setCoins] = useState(120);

  const achievements = [
    { id: 1, title: "First Bug Squashed", desc: "Successfully compile and pass test cases for 1 coding problem.", xp: 100, icon: Zap, status: "Completed", color: "var(--primary-neon)" },
    { id: 2, title: "Recruiter Favorite", desc: "Achieve an overall score of 80%+ in a simulated mock interview.", xp: 250, icon: Shield, status: "In Progress", color: "var(--secondary-neon)" },
    { id: 3, title: "Streak Master", desc: "Maintain a 5-day practice streak on the platform.", xp: 150, icon: Flame, status: "Completed", color: "#ff8c00" },
    { id: 4, title: "Speed Demon", desc: "Complete any medium level coding challenge in under 10 minutes.", xp: 200, icon: Star, status: "Locked", color: "var(--accent-pink)" },
  ];

  const badges = [
    { name: "Algorithm God", desc: "Top 1% Global Coding Rank", icon: Award, rarity: "Mythic", color: "#ffea00" },
    { name: "First Steps", desc: "Completed Registration Profile", icon: Star, rarity: "Common", color: "#e2e8f0" },
    { name: "Jarvis Buddy", desc: "Completed 5 Voice Interview simulations", icon: Shield, rarity: "Rare", color: "var(--primary-neon)" }
  ];

  const handleWin = (reward: string, xpGained: number) => {
    if (xpGained > 0) {
      onGainXp(xpGained);
    }
    if (reward.includes("Coins")) {
      const amt = parseInt(reward.split(" ")[0], 10);
      setCoins((prev) => prev + amt);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Gamification Hub</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          Earn coins, spin the rewards wheel, unlock profile badges, and complete challenges.
        </p>
      </div>

      <div className="display-grid grid-cols-3" style={{ gridTemplateColumns: "1.3fr 2fr" }}>
        
        {/* Left: Spin wheel reward & stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Wheel panel */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "bold", marginBottom: "16px" }}>DAILY SPIN REWARDS</span>
            <SpinWheel onWin={handleWin} />
          </div>

          {/* User Currency / Badges */}
          <div className="glass-panel" style={{ padding: "20px", display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Current Level</span>
              <h3 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary-neon)" }}>Lvl {user.level}</h3>
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Platform Coins</span>
              <h3 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#ffea00" }}>{coins} 🪙</h3>
            </div>
          </div>

        </div>

        {/* Right: Achievements & Badges checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Achievements */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "16px" }}>Core Challenges</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {achievements.map((ach) => {
                const Icon = ach.icon;
                return (
                  <div
                    key={ach.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 20px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", maxWidth: "80%" }}>
                      <div 
                        style={{ 
                          width: "36px", 
                          height: "36px", 
                          borderRadius: "8px", 
                          background: "rgba(255,255,255,0.03)", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          color: ach.color 
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{ach.title}</h4>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{ach.desc}</p>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span 
                        style={{ 
                          fontSize: "0.65rem", 
                          padding: "2px 6px", 
                          borderRadius: "4px",
                          background: ach.status === "Completed" ? "rgba(0,229,255,0.1)" : ach.status === "In Progress" ? "rgba(189,0,255,0.1)" : "rgba(255,0,0,0.1)",
                          color: ach.status === "Completed" ? "var(--primary-neon)" : ach.status === "In Progress" ? "var(--secondary-neon)" : "var(--text-muted)",
                          fontWeight: "bold"
                        }}
                      >
                        {ach.status}
                      </span>
                      <p style={{ fontSize: "0.75rem", color: "var(--primary-neon)", fontWeight: "600", marginTop: "4px", fontFamily: "var(--font-mono)" }}>+{ach.xp} XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badge Gallery */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "16px" }}>Earned Profile Badges</h3>
            <div className="display-grid grid-cols-3">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div 
                    key={b.name}
                    className="glass-panel"
                    style={{ 
                      padding: "16px", 
                      textAlign: "center", 
                      background: "rgba(255,255,255,0.01)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <Icon size={24} color={b.color} />
                    <div>
                      <h4 style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{b.name}</h4>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{b.rarity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
