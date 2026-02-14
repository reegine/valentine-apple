// valentine-apple\valentine-vouchers\components\SuccessPopup.tsx
'use client';

import { useEffect, useState } from 'react';
import { Heart, Gift, Sparkles, X, Camera, Coffee, Star } from 'lucide-react';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  voucherTitle: string;
  message?: string;
}

const romanticMessages = [
  { text: "Love is in the air!", icon: Sparkles },
  { text: "A beautiful memory begins...", icon: Camera },
  { text: "Sending you warm hugs!", icon: Heart },
  { text: "Sweet as honey!", icon: Coffee },
  { text: "You deserve all the love!", icon: Star },
  { text: "Another chapter in your love story!", icon: Gift },
];

export default function SuccessPopup({ isOpen, onClose, voucherTitle, message }: SuccessPopupProps) {
  const [randomMessage, setRandomMessage] = useState(romanticMessages[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRandomMessage(romanticMessages[Math.floor(Math.random() * romanticMessages.length)]);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div 
        className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-500 ${
          isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Decorative top gradient */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-pink-200 via-rose-200 to-red-200 rounded-full blur-3xl opacity-50" />
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-rose-50 rounded-full transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Animated hearts */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-heart-slow"
                style={{
                  left: `${20 + i * 15}%`,
                  top: '20%',
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                <Heart className="h-4 w-4 text-pink-200 fill-pink-200" />
              </div>
            ))}
          </div>

          {/* Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 rounded-full shadow-lg">
              <randomMessage.icon className="h-10 w-10 text-white animate-float" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3 mb-8">
            <h3 className="text-2xl font-serif font-light text-gray-800">
              {randomMessage.text}
            </h3>
            <p className="text-gray-600">
              You've successfully claimed:
            </p>
            <p className="text-lg font-medium bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              "{voucherTitle}"
            </p>
            {message && (
              <p className="text-sm text-gray-500 italic">
                {message}
              </p>
            )}
          </div>

          {/* Romantic divider */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
            <Heart className="h-3 w-3 text-pink-300 fill-pink-300" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent via-pink-200 to-transparent" />
          </div>

          {/* Button */}
          <button
            onClick={handleClose}
            className="group relative px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Continue</span>
              <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Decorative bottom */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent rounded-full" />
      </div>

      <style jsx>{`
        @keyframes float-heart-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        .animate-float-heart-slow {
          animation: float-heart-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}