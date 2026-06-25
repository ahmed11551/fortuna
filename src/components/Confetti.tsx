import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number; // percentage width (0-100)
  y: number; // initial vertical offset
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  "#F91155", // Magenta
  "#005BFF", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#3B82F6", // Light Blue
  "#EF4444"  // Red
];

export default function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 120 confetti particles
    const newParticles: Particle[] = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 30, // Start slightly above viewport
      size: Math.random() * 8 + 6, // 6px to 14px
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 3, // Stagger starting times
      duration: Math.random() * 2.5 + 2.5, // 2.5s to 5s fall duration
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 180 - 90 // rotation velocity
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0px) rotate(0deg) translateX(0px);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-25px);
            opacity: 0;
          }
        }
        .confetti-piece {
          animation-name: fall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-iteration-count: infinite;
          transform-origin: center;
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-piece"
          style={{
            left: `${p.x}%`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size * (Math.random() > 0.5 ? 1 : 0.6)}px`, // Mix rectangles & squares
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.7 ? "50%" : "2px", // Mix circles & rectangles
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
