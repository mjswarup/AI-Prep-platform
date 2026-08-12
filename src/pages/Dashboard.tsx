import React from "react";

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
  return (
    <div className="dashboard-page">
      <section className="dashboard-hero glass-panel">
        <div className="hero-decor" aria-hidden="true" />
        <div className="hero-copy">
          {/* Heading content removed per request */}
        </div>
        <div className="hero-highlights">
          <div className="hero-card">
            <span className="stat-label">Goal</span>
            <span className="stat-value">3/5</span>
          </div>
          <div className="hero-card">
            <span className="stat-label">Study Time</span>
            <span className="stat-value">2h 35m</span>
          </div>
          <div className="hero-card hero-card--accent">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{user.streak} Days</span>
          </div>
        </div>
      </section>

      <section className="mentor-panel glass-panel">
        <div className="mentor-avatar">
          <div className="mentor-avatar__glow" />
          <div className="mentor-avatar__core" />
        </div>
        <div className="mentor-body">
          <span className="mentor-chip">AI MENTOR</span>
          <p className="mentor-text">I recommend practicing <strong>SQL</strong> and <strong>Data Structures</strong> today.</p>
          <div className="mentor-actions">
            <button className="glass-button primary mentor-action" onClick={() => onNavigate("coding")}>Start Recommended Practice</button>
            <button className="glass-button mentor-action" onClick={() => onNavigate("coach")}>Ask AI Mentor</button>
          </div>
        </div>
      </section>

      <section className="tracks-section">
        <div className="tracks-header">
          <h2>Preparation Tracks</h2>
        </div>
        <div className="tracks-grid">
          <button type="button" className="track-card" onClick={() => onNavigate("crt")}>
            <div className="track-image track-image--aptitude" />
            <h3>Aptitude</h3>
            <p>45% Complete</p>
          </button>
          <button type="button" className="track-card track-card--active" onClick={() => onNavigate("coding")}>
            <div className="track-image track-image--coding" />
            <h3>Coding</h3>
            <p>Active Focus</p>
          </button>
          <button type="button" className="track-card" onClick={() => onNavigate("interview")}>
            <div className="track-image track-image--interview" />
            <h3>Interview</h3>
            <p>Not Started</p>
          </button>
          <button type="button" className="track-card" onClick={() => onNavigate("companies")}>
            <div className="track-image track-image--company" />
            <h3>Company Prep</h3>
            <p>20% Complete</p>
          </button>
        </div>
      </section>
    </div>
  );
};
