import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Building2,
  Mic,
  MessageSquare,
  FileText,
  Trophy,
  Flame,
  GraduationCap,
  Settings,
  LogOut,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: {
    name: string;
    streak: number;
    xp: number;
    level: number;
  };
  isAdmin: boolean;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, user, isAdmin, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "crt", label: "Daily CRT", icon: BookOpen },
    { id: "coding", label: "Coding Practice", icon: Code2 },
    { id: "companies", label: "Company Prep", icon: Building2 },
    { id: "interview", label: "AI Voice Interview", icon: Mic },
    { id: "resume", label: "Resume Analyzer", icon: FileText },
    { id: "test-generator", label: "Paper Generator", icon: FileText },
    { id: "coach", label: "AI Career Coach", icon: MessageSquare },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "gamification", label: "Gamification", icon: Sparkles },
    { id: "resources", label: "Resources", icon: GraduationCap },
    { id: "exam", label: "Exam Arena", icon: BookOpen },
    { id: "admin", label: "Admin Panel", icon: Settings },
  ];

  const nextLevelXp = user.level * 500;
  const xpPercentage = Math.min((user.xp / nextLevelXp) * 100, 100);

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <Sparkles size={24} style={{ stroke: "url(#blue-purple-grad)" }} />
        <span>PREP.AI</span>
      </div>

      {/* User Streak & Level Widget */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "12px", 
          marginBottom: "20px", 
          background: "rgba(255, 255, 255, 0.02)", 
          borderColor: "rgba(255, 255, 255, 0.05)" 
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Flame size={16} color="#ff8c00" fill="#ff8c00" />
            <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{user.streak} Day Streak</span>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--primary-neon)" }}>Lvl {user.level}</span>
        </div>
        
        {/* XP Progress Bar */}
        <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "3px", overflow: "hidden" }}>
          <div 
            style={{ 
              width: `${xpPercentage}%`, 
              height: "100%", 
              background: "linear-gradient(90deg, var(--primary-neon), var(--secondary-neon))",
              borderRadius: "3px",
              transition: "width 0.4s ease"
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "0.7rem", color: "var(--text-muted)" }}>
          <span>{user.xp} XP</span>
          <span>{nextLevelXp} XP</span>
        </div>
      </div>

      <nav style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <ul className="sidebar-menu">
          {menuItems
            .filter((item) => item.id !== "admin" || isAdmin)
            .map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <a
                    className={`sidebar-link ${currentTab === item.id ? "active" : ""}`}
                    onClick={() => onTabChange(item.id)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
        </ul>

        {/* Footer info & Logout */}
        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "16px", marginTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", paddingLeft: "8px" }}>
            <div 
              style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                background: "linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#03030b",
                fontWeight: "bold",
                fontSize: "0.9rem"
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>{user.name}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Premium Account</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="glass-button" 
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              background: "rgba(255,0,0,0.05)", 
              borderColor: "rgba(255,0,0,0.15)",
              color: "#ff4d4d" 
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,0,0,0.15)";
              e.currentTarget.style.borderColor = "#ff4d4d";
              e.currentTarget.style.boxShadow = "0 0 10px rgba(255,77,77,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,0,0,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,0,0,0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* SVG Gradient definition used in logo */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="blue-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#bd00ff" />
          </linearGradient>
        </defs>
      </svg>
    </aside>
  );
};
