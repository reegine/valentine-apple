// valentine-apple\valentine-vouchers\src\app\not-found.tsx
'use client';

import Link from 'next/link';
import { Heart, Home } from 'lucide-react';
import HeartBackground from '../../components/HeartBackground';

export default function NotFound() {
  return (
    <>
      <HeartBackground />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="text-9xl font-serif text-pink-300 animate-float">404</div>
            <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 text-pink-500 fill-pink-500 animate-pulse-heart opacity-50" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Oops! Love got lost
          </h1>
          
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for seems to have wandered off. 
            But don&apos;t worry, your love story continues here.
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <Home className="h-5 w-5" />
            <span>Return to Love</span>
          </Link>
        </div>
      </div>
    </>
  );
}