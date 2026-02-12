'use client';

import React from 'react';

export default function HeartBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-red-50 to-rose-100" />
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
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
              fill="rgba(255, 182, 193, 0.2)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heart-pattern)" />
      </svg>
    </div>
  );
}