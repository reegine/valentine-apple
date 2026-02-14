// valentine-apple\valentine-vouchers\src\app\login\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from 'js-cookie';
import HeartBackground from '../../../components/HeartBackground';
import { Heart, Lock, User, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [romanticMessage, setRomanticMessage] = useState('');

  const messages = [
    'Love is in the air...',
    'Your special moments await...',
    'Ready for a romantic surprise?',
    'Open your heart to possibilities...',
  ];

  useEffect(() => {
    setRomanticMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Login failed');
      }

      document.cookie = `token=${result.token}; path=/; max-age=604800; SameSite=Lax`;
      
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeartBackground />
      <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Decorative header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-200 shadow-sm">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span className="text-sm text-pink-600 font-medium">{romanticMessage}</span>
              <Sparkles className="h-4 w-4 text-pink-500" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-2xl border-2 border-pink-200 transform transition-all hover:shadow-pink-200/50">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-300 rounded-full blur-lg opacity-50 animate-pulse" />
                  <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-full">
                    <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-white fill-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-serif font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-600">
                Sign in to access your Valentine&apos;s vouchers
              </p>
            </div>
            
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('username')}
                      type="text"
                      className="appearance-none block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="Enter your username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('password')}
                      type="password"
                      className="appearance-none block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 sm:py-4 px-4 border-2 border-transparent rounded-xl text-white bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base font-medium shadow-lg hover:shadow-pink-500/50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Opening the door...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Sign in with love</span>
                    <Heart className="h-4 w-4 ml-2 fill-white animate-pulse" />
                  </div>
                )}
              </button>
            </form>

            {/* Decorative footer */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-pink-300" />
                <span className="text-xs text-pink-400">❤️</span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-pink-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}