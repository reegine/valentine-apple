// valentine-apple\valentine-vouchers\components\Navbar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Shield, Menu, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Logo from './Logo';

interface UserData {
  userId: string;
  isAdmin: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log('All cookies:', document.cookie);
    
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    const token = getCookie('token');
    console.log('Token found:', token ? 'Yes' : 'No');
    
    if (token) {
        try {
        const decoded = jwtDecode(token) as UserData;
        console.log('Decoded token:', decoded);
        setUser(decoded);
        } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
        }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        
        .font-serif-custom {
          font-family: 'Playfair Display', serif;
        }
        
        .font-sans-custom {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .nav-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-rose-100/50' 
            : 'bg-white/80 backdrop-blur-md border-b border-rose-100/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo Section - Using the new Logo component */}
            <Logo showText={true} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {user?.isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className="relative group px-4 py-2 rounded-xl text-gray-600 hover:text-rose-600 transition-all duration-300"
                  >
                    <span className="relative z-10 font-sans-custom font-medium flex items-center space-x-2">
                      <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Admin</span>
                    </span>
                    <span className="absolute inset-0 bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100" />
                  </Link>
                  <Link
                    href="/register"
                    className="relative group px-4 py-2 rounded-xl text-gray-600 hover:text-rose-600 transition-all duration-300"
                  >
                    <span className="relative z-10 font-sans-custom font-medium flex items-center space-x-2">
                      <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Register</span>
                    </span>
                    <span className="absolute inset-0 bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100" />
                  </Link>
                </>
              )}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="relative group ml-2 px-4 py-2 rounded-xl text-gray-600 hover:text-rose-600 transition-all duration-300"
              >
                <span className="relative z-10 font-sans-custom font-medium flex items-center space-x-2">
                  <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Logout</span>
                </span>
                <span className="absolute inset-0 bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100" />
              </button>

              {/* Decorative separator */}
              <div className="w-px h-6 bg-rose-200/50 mx-2" />
              
              {/* User avatar/indicator */}
              {user && (
                <div className="flex items-center space-x-2 pl-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.userId?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-rose-100 nav-slide-down">
              <div className="flex flex-col space-y-2">
                {user?.isAdmin && (
                  <>
                    <Link
                      href="/admin"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="h-5 w-5" />
                      <span className="font-sans-custom font-medium">Admin Dashboard</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-sans-custom font-medium">Register</span>
                    </Link>
                  </>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300 w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-sans-custom font-medium">Logout</span>
                </button>

                {user && (
                  <div className="px-4 py-3 flex items-center space-x-3 border-t border-rose-100 mt-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.userId?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-sans-custom text-sm text-gray-600">
                      Signed in as {user.userId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Animated gradient line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-50" />
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
}