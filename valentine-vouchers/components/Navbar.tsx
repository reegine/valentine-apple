'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, LogOut, User, Shield } from 'lucide-react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  userId: string;
  isAdmin: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Debug: Check all cookies
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

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
            <span className="font-bold text-xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Valentine Vouchers
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user?.isAdmin && (
              <>
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 transition"
                >
                  <Shield className="h-5 w-5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 transition"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 transition"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}