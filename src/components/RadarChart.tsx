import React from "react";

interface RadarChartProps {
  scores: {
    communication: number; // 0 - 100
    confidence: number;
    grammar: number;
    fluency: number;
    technical: number;
    problemSolving: number;
  };
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores, size = 300 }) => {
  const center = size / 2;
  const maxRadius = (size / 2) * 0.7; // leave space for labels

  const axes = [
    { label: "Communication", key: "communication" },
    { label: "Confidence", key: "confidence" },
    { label: "Grammar", key: "grammar" },
    { label: "Fluency", key: "fluency" },
    { label: "Technical", key: "technical" },
    { label: "Problem Solving", key: "problemSolving" },
  ];

  const totalAxes = axes.length;

  // Helper to calculate X and Y coordinates
  const getCoordinates = (index: number, value: number) => {
    // Offset by Math.PI / 2 to start at top (12 o'clock)
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Generate grid rings (concentrical hexagons)
  const rings = [20, 40, 60, 80, 100];
  const ringPolygons = rings.map((ringValue) => {
    const points = [];
    for (let i = 0; i < totalAxes; i++) {
      const { x, y } = getCoordinates(i, ringValue);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  });

  // Calculate coordinates of actual scores
  const scoreValues = axes.map((axis) => scores[axis.key as keyof typeof scores]);
  const scorePoints = scoreValues
    .map((val, idx) => {
      const { x, y } = getCoordinates(idx, val);
      return `${x},${y}`;
    })
    .join(" ");

  // Label text anchor alignment based on angle
  const getLabelAnchor = (index: number) => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const cos = Math.cos(angle);
    if (Math.abs(cos) < 0.1) return "middle";
    return cos > 0 ? "start" : "end";
  };

  const getLabelDy = (index: number) => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const sin = Math.sin(angle);
    if (sin > 0.8) return "1.2em"; // bottom
    if (sin < -0.8) return "-0.5em"; // top
    return "0.35em"; // middle
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Neon Area Gradients */}
          <linearGradient id="radar-area-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-neon)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--secondary-neon)" stopOpacity="0.4" />
          </linearGradient>
          {/* Neon Stroke Filter */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric grid rings */}
        {ringPolygons.map((points) => (
          <polygon
            key={points}
            points={points}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {axes.map((axis, idx) => {
          const { x, y } = getCoordinates(idx, 100);
          return (
            <line
              key={axis.key}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* The data area */}
        <polygon
          points={scorePoints}
          fill="url(#radar-area-grad)"
          stroke="var(--primary-neon)"
          strokeWidth="2"
          filter="url(#glow-cyan)"
          style={{ transition: "all 0.5s ease-in-out" }}
        />

        {/* Outer points indicators */}
        {axes.map((axis, idx) => {
          const val = scores[axis.key as keyof typeof scores];
          const { x, y } = getCoordinates(idx, val);
          return (
            <circle
              key={axis.key}
              cx={x}
              cy={y}
              r="4"
              fill="var(--primary-neon)"
              stroke="#03030b"
              strokeWidth="1.5"
              style={{ transition: "all 0.5s ease-in-out" }}
            />
          );
        })}

        {/* Labels text */}
        {axes.map((axis, idx) => {
          // Push text slightly further than 100% boundary
          const labelDistMultiplier = 1.15;
          const angle = (idx * 2 * Math.PI) / totalAxes - Math.PI / 2;
          const x = center + maxRadius * labelDistMultiplier * Math.cos(angle);
          const y = center + maxRadius * labelDistMultiplier * Math.sin(angle);
          const val = scores[axis.key as keyof typeof scores];

          return (
            <g key={axis.key}>
              <text
                x={x}
                y={y}
                textAnchor={getLabelAnchor(idx)}
                dy={getLabelDy(idx)}
                fill="var(--text-secondary)"
                fontSize="11"
                fontWeight="500"
                fontFamily="var(--font-sans)"
              >
                {axis.label}
              </text>
              <text
                x={x}
                y={y}
                textAnchor={getLabelAnchor(idx)}
                dy={idx === 3 || idx === 0 ? "1.45em" : "-1.45em"} // shift to avoid overlap
                fill="var(--primary-neon)"
                fontSize="10"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {val}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
