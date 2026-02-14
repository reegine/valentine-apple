// valentine-apple\valentine-vouchers\components\HeartBackground.tsx
'use client';

import React, { useEffect, useState } from 'react';

export default function HeartBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hearts, setHearts] = useState<Array<{ left: string; top: string; delay: string; duration: string; size: number; opacity: number }>>([]);

  useEffect(() => {
    // Generate hearts only on client side after mount
    const generatedHearts = [];
    for (let i = 0; i < 20; i++) {
      generatedHearts.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${10 + Math.random() * 10}s`,
        size: 20 + Math.random() * 30,
        opacity: 0.1 + Math.random() * 0.2,
      });
    }
    setHearts(generatedHearts);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50" />
      
      {/* Animated floating hearts - only render on client */}
      {hearts.length > 0 && (
        <div className="absolute inset-0">
          {hearts.map((heart, i) => (
            <div
              key={i}
              className="absolute animate-float-heart"
              style={{
                left: heart.left,
                top: heart.top,
                animationDelay: heart.delay,
                animationDuration: heart.duration,
                opacity: heart.opacity,
              }}
            >
              <svg
                width={heart.size}
                height={heart.size}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-pink-300"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Interactive gradient that follows mouse */}
      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 182, 193, 0.3) 0%, transparent 50%)`,
        }}
      />

      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern
            id="heart-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 30 C20 30, 8 22, 8 15 C8 10, 12 6, 20 10 C28 6, 32 10, 32 15 C32 22, 20 30, 20 30"
              fill="rgba(255, 182, 193, 0.15)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heart-pattern)" />
      </svg>
    </div>
  );
}