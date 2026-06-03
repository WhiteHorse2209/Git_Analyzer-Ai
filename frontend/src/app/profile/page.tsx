'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, History, ExternalLink, Terminal, ChevronLeft, LogOut, Code as Github } from 'lucide-react';
import { profileService } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await profileService.getProfile(token);
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-5 h-5 text-zinc-500" />
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Terminal className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">GitAnalyzer <span className="text-blue-600">AI</span></span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none text-center">
              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-white dark:border-zinc-900 shadow-lg">
                <User className="w-12 h-12 text-zinc-400" />
              </div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 flex items-center justify-center gap-1">
                <Mail className="w-3 h-3" /> {user?.email}
              </p>
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 text-left">
                <p className="text-xs uppercase tracking-widest font-black text-zinc-400 mb-4">Account Stats</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Repos Analyzed</span>
                  <span className="font-bold text-blue-600">{user?.history?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity/History Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none min-h-[500px]">
              <div className="flex items-center gap-2 mb-8">
                <History className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">Analysis History</h3>
              </div>

              {(!user?.history || user.history.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                  <Github className="w-12 h-12 mb-4 opacity-20" />
                  <p>No repositories analyzed yet.</p>
                  <Link href="/" className="mt-4 text-blue-600 font-bold hover:underline">Start analyzing →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.history.map((item: any, i: number) => (
                    <div key={i} className="group p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-between hover:border-blue-400 transition-all">
                      <div>
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200">{item.repo_name}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs md:max-w-md">{item.repo_url}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <a href={item.repo_url} target="_blank" className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:text-blue-600 transition-colors shadow-sm">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 mt-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-900 dark:text-white font-bold mb-2">Created By <span className="text-blue-600">SHAIK JAHEER AHMED</span></p>
          <div className="flex justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <a href="mailto:jaheer@example.com" className="hover:text-blue-600">jaheer@example.com</a>
            <span>•</span>
            <a href="https://github.com" className="hover:text-blue-600">GitHub</a>
            <span>•</span>
            <a href="https://linkedin.com" className="hover:text-blue-600">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
