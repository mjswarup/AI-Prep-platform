import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play } from "lucide-react";

const rewards = [
  { label: "50 XP", color: "#1a0033", xp: 50 },
  { label: "10 Coins", color: "#003366", xp: 10 },
  { label: "100 XP", color: "#2d004d", xp: 100 },
  { label: "20 Coins", color: "#004d80", xp: 20 },
  { label: "Mock Ticket", color: "#4d004d", xp: 150 },
  { label: "Try Again", color: "#0d0d1a", xp: 0 },
  { label: "200 XP", color: "#660066", xp: 200 },
  { label: "50 Coins", color: "#006699", xp: 50 },
];

const totalSegments = rewards.length;
const arcSize = (2 * Math.PI) / totalSegments;

interface SpinWheelProps {
  onWin: (reward: string, xpGained: number) => void;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Draw the wheel static template
  const drawWheel = useCallback((currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    // Save context to rotate
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(currentAngle);

    // Draw slices
    for (let i = 0; i < totalSegments; i++) {
      const angle = i * arcSize;
      
      // Draw slice background
      ctx.beginPath();
      ctx.fillStyle = rewards[i].color;
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arcSize);
      ctx.lineTo(0, 0);
      ctx.fill();

      // Border lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw texts inside slices
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px 'Outfit', sans-serif";
      // Rotate to segment center angle
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.fillText(rewards[i].label, radius - 30, 5);
      ctx.restore();
    }

    ctx.restore();

    // Draw center peg/button
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(3, 3, 11, 0.9)";
    ctx.strokeStyle = "var(--primary-neon)";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "var(--primary-neon)";
    ctx.fill();
    ctx.stroke();
    // clear shadow
    ctx.shadowBlur = 0;

    // Draw pointer at 3 o'clock (0 angle pointer position)
    ctx.beginPath();
    ctx.moveTo(size - 5, center);
    ctx.lineTo(size - 25, center - 12);
    ctx.lineTo(size - 25, center + 12);
    ctx.closePath();
    ctx.fillStyle = "var(--accent-pink)";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  }, []);

  useEffect(() => {
    drawWheel(0);
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    const spinTimeTotal = Math.random() * 3000 + 3000; // 3 to 6s
    let spinTimeStart = 0;
    const startAngle = Math.random() * 2 * Math.PI;
    const extraSpins = Math.PI * 8; // 4 full loops minimum

    const animateSpin = (timestamp: number) => {
      if (!spinTimeStart) spinTimeStart = timestamp;
      const elapsed = timestamp - spinTimeStart;

      if (elapsed < spinTimeTotal) {
        // Decelerating calculation
        const progress = elapsed / spinTimeTotal;
        // Ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + easeOut * extraSpins;
        
        drawWheel(currentAngle);
        requestAnimationFrame(animateSpin);
      } else {
        const finalAngle = startAngle + extraSpins;
        drawWheel(finalAngle);
        setIsSpinning(false);

        // Calculate segment pointer lands on (at 0 radians/3 o'clock)
        // Adjust for canvas coordinates rotation (0 angle is pointing right)
        // finalAngle % (2 * Math.PI) is the angle the wheel rotated.
        // The pointer is static at 0 angle (3 o'clock).
        // Since wheel rotates clockwise: target slice is at: (2 * Math.PI - (finalAngle % 2PI)) / arcSize
        const normalizedAngle = finalAngle % (2 * Math.PI);
        const pointingAngle = (2 * Math.PI - normalizedAngle) % (2 * Math.PI);
        const winnerIndex = Math.floor(pointingAngle / arcSize);
        
        const winReward = rewards[winnerIndex];
        setWinner(winReward.label);
        onWin(winReward.label, winReward.xp);
      }
    };

    requestAnimationFrame(animateSpin);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{
            maxWidth: "100%",
            borderRadius: "50%",
            boxShadow: "0 0 25px rgba(0,229,255,0.15)",
          }}
        />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="glass-button primary"
        style={{
          padding: "12px 30px",
          fontSize: "1.1rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Play size={18} fill="#03030b" />
        {isSpinning ? "Spinning..." : "SPIN WHEEL"}
      </button>

      {winner && (
        <div
          className="glass-panel"
          style={{
            padding: "12px 24px",
            borderColor: "var(--primary-neon)",
            animation: "pulse 1.5s infinite",
            background: "rgba(0,229,255,0.05)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>CONGRATULATIONS! YOU WON</span>
          <h3 style={{ fontSize: "1.4rem", color: "var(--primary-neon)", margin: "4px 0 0" }}>{winner}</h3>
        </div>
      )}
    </div>
  );
};
