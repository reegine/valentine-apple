'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Shield } from 'lucide-react';
import HeartBackground from '../../../components/HeartBackground'; 

const registrationFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  isAdmin: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      isAdmin: false,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      router.push('/admin');
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
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
          
          .romantic-card {
            font-family: 'Crimson Text', serif;
            animation: floatIn 0.8s ease-out;
          }
          
          .romantic-title {
            font-family: 'Playfair Display', serif;
          }
          
          @keyframes floatIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse-glow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(251, 113, 133, 0.3);
            }
            50% { 
              box-shadow: 0 0 30px rgba(251, 113, 133, 0.5);
            }
          }
          
          .shield-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          
          .input-field {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .input-field:focus {
            transform: translateY(-2px);
          }
          
          .checkbox-custom {
            transition: all 0.2s ease;
          }
          
          .checkbox-custom:checked {
            transform: scale(1.1);
          }
        `}</style>

        <div className="romantic-card max-w-md w-full bg-white/95 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-2xl border-2 border-rose-100 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100/40 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-100/40 to-transparent rounded-tr-full" />
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-xl opacity-50" />
                <div className="shield-glow relative bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 p-4 rounded-full shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="romantic-title text-center text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
              Create Account
            </h2>
            <p className="text-center text-base sm:text-lg text-gray-600 mb-8 italic">
              Admin registration only
            </p>
          
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div className="relative">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-rose-400 transition-colors" />
                    </div>
                    <input
                      {...register('username')}
                      type="text"
                      className="input-field appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white/50 text-base"
                      placeholder="Choose a username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-in slide-in-from-top-1">
                      <span className="mr-1">•</span> {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-rose-400 transition-colors" />
                    </div>
                    <input
                      {...register('password')}
                      type="password"
                      className="input-field appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white/50 text-base"
                      placeholder="Create a password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-in slide-in-from-top-1">
                      <span className="mr-1">•</span> {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-rose-400 transition-colors" />
                    </div>
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className="input-field appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white/50 text-base"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-in slide-in-from-top-1">
                      <span className="mr-1">•</span> {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 bg-rose-50/50 p-4 rounded-2xl border-2 border-rose-100 hover:border-rose-200 transition-colors">
                  <input
                    {...register('isAdmin')}
                    type="checkbox"
                    id="isAdmin"
                    className="checkbox-custom w-5 h-5 rounded-lg border-2 border-rose-300 text-rose-500 focus:ring-rose-400 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="isAdmin" className="text-sm text-gray-700 font-medium cursor-pointer select-none">
                    Grant admin privileges
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 border-2 border-transparent rounded-2xl text-white text-lg font-semibold bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 hover:from-rose-500 hover:via-pink-500 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Register
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}