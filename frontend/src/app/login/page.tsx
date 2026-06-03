'use client';

import React, { useState } from 'react';
import { Mail, Lock, Loader2, Terminal, LogIn } from 'lucide-react';
import { authService } from '@/services/api';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.login(formData);
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        toast.success('Login successful!');
        router.push('/');
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4">
          <Terminal className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Sign in to GitAnalyzer</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Or{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl shadow-zinc-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-zinc-200 dark:border-zinc-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" /> Sign in
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <footer className="py-8 mt-auto text-center">
        <p className="text-zinc-900 dark:text-white font-bold mb-2">Created By <span className="text-blue-600">SHAIK JAHEER AHMED</span></p>
        <div className="flex justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <a href="mailto:jaheer@example.com" className="hover:text-blue-600">jaheer@example.com</a>
          <span>•</span>
          <a href="https://github.com" className="hover:text-blue-600">GitHub</a>
          <span>•</span>
          <a href="https://linkedin.com" className="hover:text-blue-600">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
