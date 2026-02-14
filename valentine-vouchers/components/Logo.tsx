// valentine-apple\valentine-vouchers\components\Logo.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = true }: LogoProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Link 
      href="/" 
      className="flex items-center space-x-2 sm:space-x-3 group relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated background */}
      <div className={`absolute -inset-2 bg-gradient-to-r from-rose-100/0 via-rose-100/50 to-rose-100/0 rounded-2xl blur-xl transition-all duration-700 ${
        isHovering ? 'opacity-100 scale-110' : 'opacity-0'
      }`} />
      
      {/* Logo Image */}
      <div className="relative">
        <div className="absolute inset-0 bg-rose-200 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-all" />
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <Image
            src="/logo/apple-icon.png"
            alt="RR's Valentine Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Text (optional) */}
      {showText && (
        <div className="relative">
          <span className="font-serif-custom font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent group-hover:from-rose-500 group-hover:via-pink-500 group-hover:to-rose-500 transition-all duration-300">
            RR's Valentine
          </span>
          {/* Subtle underline effect */}
          <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 rounded-full transition-all duration-300 ${
            isHovering ? 'w-full' : 'w-0'
          }`} />
        </div>
      )}
    </Link>
  );
}