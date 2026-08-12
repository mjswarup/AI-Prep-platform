import { useState, useCallback, useMemo } from "react";
import { FloatingBubbles } from "./components/FloatingBubbles";
import { Sidebar } from "./components/Sidebar";

// Import all pages
import { LandingPage } from "./pages/LandingPage";
import { LoginRegister } from "./pages/LoginRegister";
import { Dashboard } from "./pages/Dashboard";
import { CompanyPrep } from "./pages/CompanyPrep";
import { DailyCRT } from "./pages/DailyCRT";
import { CodingPractice } from "./pages/CodingPractice";
import { ResumeAnalyzer } from "./pages/ResumeAnalyzer";
import { VoiceInterview } from "./pages/VoiceInterview";
import { CareerCoach } from "./pages/CareerCoach";
import { Leaderboard } from "./pages/Leaderboard";
import { Gamification } from "./pages/Gamification";
import { Resources } from "./pages/Resources";
import { AdminPanel } from "./pages/AdminPanel";
import { PlacementAssessment } from "./pages/PlacementAssessment";
import { TestGenerator } from "./pages/TestGenerator";

interface User {
  name: string;
  college: string;
  branch: string;
  gradYear: string;
  dreamCompanies: string[];
  streak: number;
  xp: number;
  level: number;
  isAdmin?: boolean;
}

function App() {
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Logged in user profile data
  const [user, setUser] = useState<User>({
    name: "Ananya Rao",
    college: "IIT Madras",
    branch: "Computer Science & Engineering",
    gradYear: "2027",
    dreamCompanies: ["Google", "Amazon", "Microsoft"],
    streak: 4,
    xp: 340,
    level: 1
  });

  // Callback to reward XP
  const handleGainXp = useCallback((xpGained: number) => {
    setUser((prev) => {
      let newXp = prev.xp + xpGained;
      let newLevel = prev.level;
      let nextLevelXp = newLevel * 500;

      // Handle level up
      while (newXp >= nextLevelXp) {
        newXp -= nextLevelXp;
        newLevel += 1;
        nextLevelXp = newLevel * 500;
        alert(`🎉 LEVEL UP! You reached Level ${newLevel}!`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  }, []);

  const handleLoginSuccess = useCallback((userData: Partial<User> & { isAdmin?: boolean }) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData,
    }));
    setIsAdmin(Boolean(userData.isAdmin));
    setIsLoggedIn(true);
    setCurrentTab("dashboard");
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentTab("landing");
  }, []);

  // Render proper page based on currentTab state
  const renderPage = useMemo(() => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard user={user} onNavigate={setCurrentTab} />;
      case "companies":
        return <CompanyPrep onStartPractice={setCurrentTab} />;
      case "crt":
        return <DailyCRT onGainXp={handleGainXp} />;
      case "coding":
        return <CodingPractice onGainXp={handleGainXp} />;
      case "resume":
        return <ResumeAnalyzer />;
      case "interview":
        return <VoiceInterview onGainXp={handleGainXp} />;
      case "coach":
        return <CareerCoach />;
      case "leaderboard":
        return <Leaderboard />;
      case "gamification":
        return <Gamification user={user} onGainXp={handleGainXp} />;
      case "resources":
        return <Resources />;
      case "exam":
        return <PlacementAssessment />;
      case "test-generator":
        return <TestGenerator />;
      case "admin":
        return isAdmin ? <AdminPanel /> : <Dashboard user={user} onNavigate={setCurrentTab} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentTab} />;
    }
  }, [currentTab, user, handleGainXp]);

  const onExploreCompanies = useCallback(() => {
    // Direct navigation to explore companies is allowed for guests
    setUser(prevUser => ({
      ...prevUser,
      name: "Guest Student",
      college: "None",
      dreamCompanies: ["Google", "Amazon"]
    }));
    setIsLoggedIn(true); // Simulate a guest login to show dashboard framework
    setCurrentTab("companies");
  }, []);

  const renderContent = () => {
    if (isLoggedIn) {
      return (
        <div className="dashboard-layout">
          <Sidebar 
            currentTab={currentTab} 
            onTabChange={setCurrentTab} 
            user={user} 
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />
          <main className="dashboard-content">
            {renderPage}
          </main>
        </div>
      );
    }
    if (currentTab === "login") {
      return <LoginRegister onSuccess={handleLoginSuccess} onBackToHome={() => setCurrentTab("landing")} />;
    }
    // Default to LandingPage for guests
    return <LandingPage onStart={() => setCurrentTab("login")} onExploreCompanies={onExploreCompanies} onLoginClick={() => setCurrentTab("login")} />;
  };

  return (
    <>
      {/* Background glowing aurora & floating water bubbles */}
      <div className="aurora-bg" />
      <FloatingBubbles />
      {renderContent()}
    </>
  );
}

export default App;
