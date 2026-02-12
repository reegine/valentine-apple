'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from 'js-cookie';
import HeartBackground from '../../../components/HeartBackground';
import { Heart, Lock, User } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // When you get the token from your login API
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

        // ✅ Set cookie with proper attributes
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
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-pink-200">
          <div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-full">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your Valentine&apos;s vouchers
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('username')}
                    type="text"
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}