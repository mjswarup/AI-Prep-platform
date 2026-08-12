import React, { useState } from "react";
import { Code2, Database, Globe, Layers, Terminal, Compass } from "lucide-react";

export const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Core CS", "System Design", "Aptitude"];

  const resourcesData = [
    { title: "Data Structures & Algorithms", desc: "Systematic cheatsheet containing complexity tables and core code implementation references.", topics: ["Recursion & Backtracking", "Trees, Heaps, and Graphs", "Dynamic Programming patterns", "Sliding window algorithms"], icon: Code2, cat: "Core CS", linkLabel: "View DSA Roadmap" },
    { title: "Operating Systems Concepts", desc: "Core OS topics frequently asked in technical recruitment interview rounds.", topics: ["Process Synchronization (Semaphores)", "Memory Management & Paging", "CPU Scheduling Algorithms", "Deadlock Prevention & Detection"], icon: Terminal, cat: "Core CS", linkLabel: "Download OS Guide" },
    { title: "DBMS & SQL Query Guides", desc: "Comprehensive SQL queries repository, normalizations, and transactional structures.", topics: ["Entity Relationship diagrams", "Database Normalizations (1NF to BCNF)", "SQL Join structures & subqueries", "ACID transactions & locking"], icon: Database, cat: "Core CS", linkLabel: "View SQL Practice Sheet" },
    { title: "System Design Frameworks", desc: "Learn to design large scalable microservice architectures and caching setups.", topics: ["Horizontal vs Vertical scaling", "Load Balancers & Reverse Proxies", "Caching with Redis & Memcached", "Message Queues (Kafka, RabbitMQ)"], icon: Layers, cat: "System Design", linkLabel: "Grokking System Design" },
    { title: "Computer Networks Fundamentals", desc: "Core protocols, packets structures, and internet routing layers.", topics: ["TCP/IP vs OSI model layers", "Three-way handshake & flow control", "DNS resolution process", "HTTP / HTTPS packet security"], icon: Globe, cat: "Core CS", linkLabel: "Download Networking cheat sheet" },
    { title: "Quantitative & Logical Aptitude", desc: "Core formulas and tricks to solve assessment mathematics quickly.", topics: ["Percentages, Profit & Loss", "Time, Speed, Distance equations", "Permutations & Combinations formulas", "Data Interpretation charts"], icon: Compass, cat: "Aptitude", linkLabel: "Aptitude Tricks PDF" }
  ];

  const filteredResources = activeCategory === "All" 
    ? resourcesData 
    : resourcesData.filter(r => r.cat === activeCategory);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeIn 0.5s ease-out" }}>
      <div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Placement Study Resources</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          Curated guides, cheat sheets, and roadmaps covering computer science fundamentals and system design.
        </p>
      </div>

      {/* Filter Header */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
        {categories.map((cat) => (
          <button
            key={cat} // Using the category name itself as the key
            onClick={() => setActiveCategory(cat)}
            className={`glass-button ${activeCategory === cat ? "active" : ""}`}
            style={{ fontSize: "0.8rem", padding: "6px 14px" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Resource Cards */}
      <div className="display-grid grid-cols-2">
        {filteredResources.map((res) => {
          const Icon = res.icon;
          return (
            <div key={res.title} className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(0, 229, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-neon)" }}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>{res.title}</h3>
                  <span style={{ fontSize: "0.65rem", color: "var(--primary-neon)", fontWeight: "bold" }}>{res.cat}</span>
                </div>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                {res.desc}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold" }}>KEY SUB-TOPICS</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  {res.topics.map((t) => (
                    <span 
                      key={t}
                      style={{ 
                        fontSize: "0.7rem", 
                        padding: "3px 8px", 
                        borderRadius: "12px", 
                        background: "rgba(255,255,255,0.02)", 
                        border: "1px solid rgba(255,255,255,0.05)",
                        color: "var(--text-secondary)"
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "12px" }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Opening resource: ${res.title}`);
                  }}
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--primary-neon)",
                    textDecoration: "none",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                  onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
                >
                  <span>{res.linkLabel}</span>
                  <span>→</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
