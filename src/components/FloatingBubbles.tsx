import React, { useEffect, useState } from "react";

interface BubbleProps {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
}

export const FloatingBubbles: React.FC = () => {
  const [bubbles, setBubbles] = useState<BubbleProps[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate static details for bubbles
    const bubbleCount = 20;
    const items: BubbleProps[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      items.push({
        id: i,
        size: Math.random() * 80 + 30, // 30px to 110px
        left: Math.random() * 95, // % position
        delay: Math.random() * 10, // seconds delay
        duration: Math.random() * 15 + 15, // 15s to 30s float speed
      });
    }
    setBubbles(items);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) * 0.03, // subtle shift
        y: (e.clientY - window.innerHeight / 2) * 0.03,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bubble-canvas">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            transform: `translate(${mousePos.x * (bubble.size / 60)}px, ${mousePos.y * (bubble.size / 60)}px)`,
            transition: "transform 0.2s ease-out",
          }}
        />
      ))}
    </div>
  );
};
