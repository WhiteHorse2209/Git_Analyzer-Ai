'use client';

import React, { useState, useEffect } from 'react';
import { Search, Code as Github, Send, Loader2, BookOpen, MessageSquare, Terminal, LogOut, User as UserIcon } from 'lucide-react';
import { repoService, profileService } from '@/services/api';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [indexedRepo, setIndexedRepo] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleCloneAndIndex = async () => {
    if (!repoUrl) {
      toast.error('Please enter a GitHub repository URL');
      return;
    }

    try {
      setIsCloning(true);
      toast.loading('Cloning repository...', { id: 'clone' });
      
      const cloneRes = await repoService.clone(repoUrl);
      const repoPath = cloneRes.data.repo_path;
      const repoName = repoPath.split(/[\\/]/).pop();
      
      toast.success('Repository cloned successfully!', { id: 'clone' });
      setIsCloning(false);
      
      setIsIndexing(true);
      toast.loading('Indexing repository for AI...', { id: 'index' });
      
      await repoService.index(repoName);
      
      // Save to history
      const token = localStorage.getItem('token');
      if (token) {
        await profileService.addHistory({
          repo_url: repoUrl,
          repo_name: repoName,
          timestamp: new Date().toISOString()
        }, token);
      }

      setIndexedRepo(repoName);
      toast.success('Repository indexed and ready!', { id: 'index' });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.detail || 'An error occurred during setup');
      toast.dismiss('clone');
      toast.dismiss('index');
    } finally {
      setIsCloning(false);
      setIsIndexing(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !indexedRepo) return;

    const userQuestion = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', content: userQuestion }]);
    
    try {
      setIsChatting(true);
      const res = await repoService.chat(userQuestion, indexedRepo);
      setChatHistory(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch (error: any) {
      toast.error('Failed to get answer from AI');
    } finally {
      setIsChatting(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <Toaster position="bottom-right" />
      
      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Terminal className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">GitAnalyzer <span className="text-blue-600">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <UserIcon className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-medium">Account</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-red-500"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        {!indexedRepo && (
          <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
              Understand Any Codebase <br />
              <span className="text-blue-600">Instantly</span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Clone any GitHub repository and start chatting with its codebase. 
              Get explanations, find bugs, and navigate logic with AI.
            </p>
          </div>
        )}

        {/* Setup Section */}
        <div className={`transition-all duration-700 ease-in-out ${indexedRepo ? 'mb-8' : 'max-w-2xl mx-auto mb-16'}`}>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub Repository URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://github.com/username/repo"
                  className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isCloning || isIndexing}
                />
                <button
                  onClick={handleCloneAndIndex}
                  disabled={isCloning || isIndexing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  {(isCloning || isIndexing) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  {isCloning ? 'Cloning...' : isIndexing ? 'Indexing...' : 'Analyze'}
                </button>
              </div>
            </div>
            
            {indexedRepo && (
              <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 animate-in fade-in duration-500">
                <BookOpen className="w-4 h-4" />
                <span>Currently analyzing: <strong>{indexedRepo}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        {indexedRepo && (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-[650px] overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-bold">AI Code Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Active Analysis</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-full border border-zinc-100 dark:border-zinc-800">
                      <MessageSquare className="w-12 h-12 text-zinc-300" />
                    </div>
                    <div className="text-center max-w-sm">
                      <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-2">Start the conversation</h3>
                      <p className="text-sm">
                        Ask about architecture, logic, or specific functions. Try "Give me a summary of the commit history."
                      </p>
                    </div>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10' 
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-700 shadow-sm'
                    }`}>
                      <div className={`prose prose-sm dark:prose-invert max-w-none ${msg.role === 'user' ? 'text-white' : ''}`}>
                        <ReactMarkdown 
                          components={{
                            pre: ({node, ...props}) => <pre className="bg-zinc-900 text-zinc-100 p-3 rounded-lg overflow-x-auto my-2 border border-zinc-700" {...props} />,
                            code: ({node, ...props}) => <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded font-mono text-xs" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold my-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-md font-bold my-2" {...props} />,
                            p: ({node, ...props}) => <p className="leading-relaxed mb-2 last:mb-0" {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none px-5 py-4 border border-zinc-200 dark:border-zinc-700">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800">
                <form onSubmit={handleChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask anything about the code..."
                    className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isChatting}
                  />
                  <button
                    type="submit"
                    disabled={isChatting || !question}
                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
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
