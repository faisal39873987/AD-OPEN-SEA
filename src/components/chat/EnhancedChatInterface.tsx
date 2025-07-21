'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PaperAirplaneIcon, 
  Bars3Icon, 
  PlusIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon, 
  SparklesIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/SimpleThemeContext';
import { User as SupabaseUser } from '@supabase/supabase-js';
import AuthModal from '@/components/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';

// Debounce function to limit the frequency of calls
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Default GPT mode
const DEFAULT_GPT_MODE = false;

export default function EnhancedChatInterface() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gptMode, setGptMode] = useState<boolean>(DEFAULT_GPT_MODE);

  // Use theme context
  const { theme, toggleTheme } = useTheme();
  
  // Create a reference for message end
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize Supabase auth
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // If user is logged in, get their preferences
      if (user) {
        fetchUserPreferences(user.id);
      }
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);
        
        // If user logged in, get their preferences
        if (newUser && event === 'SIGNED_IN') {
          fetchUserPreferences(newUser.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  // Function to fetch user preferences from Supabase
  const fetchUserPreferences = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('gpt_mode')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching preferences:', error);
        return;
      }
      
      // If user has saved preference, use it
      if (data) {
        setGptMode(data.gpt_mode);
      }
    } catch (err) {
      console.error('Failed to fetch user preferences:', err);
    }
  };
  
  // Function to save user preference to Supabase
  const saveUserPreference = useCallback(
    debounce(async (userId: string, gptMode: boolean) => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .upsert(
            { user_id: userId, gpt_mode: gptMode },
            { onConflict: 'user_id' }
          );
          
        if (error) {
          console.error('Error saving preferences:', error);
        }
      } catch (err) {
        console.error('Failed to save user preferences:', err);
      }
    }, 500),
    []
  );
  
  // Handle GPT mode toggle
  const handleGptModeToggle = () => {
    const newGptMode = !gptMode;
    setGptMode(newGptMode);
    
    // Save to localStorage for non-logged in users
    localStorage.setItem('gpt_mode', JSON.stringify(newGptMode));
    
    // If user is logged in, save to Supabase
    if (user) {
      saveUserPreference(user.id, newGptMode);
    }
  };

  // Simplified component that would normally have all the chat interface logic
  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} py-4 px-4`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">AD Pulse Chat</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* GPT Mode Toggle */}
            <div className="flex items-center mr-4">
              <span className="mr-2 text-sm">GPT Mode</span>
              <button
                onClick={handleGptModeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  gptMode ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gptMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {/* User Controls */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm hidden md:inline-block">{user.email}</span>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-semibold mb-2">Welcome to AD Pulse Chat</h2>
              <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Ask any question about services or assistance
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                {['How do I find a plumber?', 'What services are available?', 'How much does AC repair cost?', 'I need help with home cleaning'].map((suggestion, i) => (
                  <button
                    key={i}
                    className={`p-3 text-left rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-700 hover:bg-gray-800' 
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() => setInputValue(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex justify-center mb-4">
                  <div className="flex items-center space-x-2 text-red-500 bg-red-100 p-3 rounded-lg">
                    <ExclamationCircleIcon className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>
      
      {/* Input Area */}
      <div className={`border-t p-4 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Submit logic would go here
            }}
            className="flex items-end"
          >
            <div className={`relative flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg px-4 py-3`}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                rows={1}
                className={`w-full focus:outline-none resize-none ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`ml-2 p-3 rounded-full ${
                isLoading || !inputValue.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>
              Mode: {gptMode ? 'GPT (AI Assistant)' : 'Database Search'}
            </span>
            <button onClick={handleGptModeToggle} className="underline">
              Switch mode
            </button>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            initialMode={authMode}
            onModeChange={(mode) => setAuthMode(mode as 'login' | 'signup')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
