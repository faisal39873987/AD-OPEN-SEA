'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, PaperclipIcon, Send, Mic } from 'lucide-react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Dynamically import modal components to avoid hydration issues
const AuthModal = dynamic(
  () => import('@/components/auth/AuthModal'),
  { ssr: false }
);

const PaymentModal = dynamic(
  () => import('@/components/PaymentModal'),
  { ssr: false }
);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  location: string;
  rating: number;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Supabase auth
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthOpen = (mode: 'login' | 'register' | 'reset' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      // Check for specific keywords
      if (inputValue.toLowerCase().includes('payment') || 
          inputValue.toLowerCase().includes('pay') || 
          inputValue.toLowerCase().includes('دفع')) {
        response = "Would you like to proceed to payment? You can access our payment services with one click.";
        
        // Set up a sample service for payment
        setSelectedService({
          id: "service-123",
          name: "Premium Consultation",
          description: "One hour consultation with our expert",
          price: 299,
          category: "Professional Services",
          location: "Online",
          rating: 4.9
        });
        
        setTimeout(() => setIsPaymentModalOpen(true), 1000);
      } else if (inputValue.toLowerCase().includes('login') || 
                inputValue.toLowerCase().includes('sign in') || 
                inputValue.toLowerCase().includes('تسجيل دخول')) {
        response = "You can sign in using the button at the top right of the screen, or click the button below.";
      } else if (inputValue.toLowerCase().includes('help') || 
                inputValue.toLowerCase().includes('مساعدة')) {
        response = "I'm here to assist you with any questions about our services. Would you like information about payments, services, or something else?";
      } else {
        response = "Thank you for your message. How can I assist you further with our services today?";
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const suggestedQuestions = [
    { text: "Tell me about your services", icon: "📋" },
    { text: "How do payments work?", icon: "💳" },
    { text: "Get advice on services", icon: "💡" },
    { text: "Summarize my options", icon: "📝" },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-medium text-white">ChatGPT</h1>
            <div className="relative">
              <button className="text-gray-400 text-sm hover:text-white bg-transparent px-2 py-1 rounded-md hover:bg-[#2a2a2a] transition">
                GPT-4
                <span className="ml-1 opacity-60">▼</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <button 
                onClick={() => supabase.auth.signOut()}
                className="text-gray-300 text-sm hover:text-white px-3 py-1 rounded-md hover:bg-[#2a2a2a] transition"
              >
                Sign out
              </button>
            ) : (
              <>
                <button 
                  onClick={() => handleAuthOpen('login')}
                  className="text-gray-300 text-sm hover:text-white bg-[#2a2a2a] px-3 py-1 rounded-md hover:bg-[#3a3a3a] transition"
                >
                  Log in
                </button>
                <button 
                  onClick={() => handleAuthOpen('register')}
                  className="text-black text-sm bg-white px-3 py-1 rounded-md hover:bg-gray-200 transition"
                >
                  Sign up for free
                </button>
              </>
            )}
            <Link href="/settings" className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
              <h2 className="text-3xl font-medium text-white mb-6">ChatGPT</h2>
              
              {/* Suggestion Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl mb-10">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="flex items-center p-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-left text-gray-200 transition-colors"
                    onClick={() => {
                      setInputValue(question.text);
                    }}
                  >
                    <span className="mr-3 text-xl" aria-hidden="true">{question.icon}</span>
                    <span>{question.text}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4 justify-center flex-wrap">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white bg-transparent px-3 py-1 rounded-md hover:bg-[#2a2a2a] transition">
                  <Sparkles className="h-4 w-4" />
                  <span>Summarize text</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white bg-transparent px-3 py-1 rounded-md hover:bg-[#2a2a2a] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  <span>Get advice</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white bg-transparent px-3 py-1 rounded-md hover:bg-[#2a2a2a] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                  <span>Code</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white bg-transparent px-3 py-1 rounded-md hover:bg-[#2a2a2a] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span>Analyze images</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-20">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#2a2a2a] text-white'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.role === 'assistant' && message.content.includes('payment') && (
                      <div className="mt-2">
                        <button
                          onClick={() => setIsPaymentModalOpen(true)}
                          className="inline-block mt-2 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition"
                        >
                          Go to Payment
                        </button>
                      </div>
                    )}
                    {message.role === 'assistant' && message.content.includes('sign in') && (
                      <div className="mt-2">
                        <button
                          onClick={() => handleAuthOpen('login')}
                          className="inline-block mt-2 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition"
                        >
                          Sign In
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#2a2a2a] text-white rounded-lg p-4 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>
      
      {/* Input Area */}
      <div className="border-t border-gray-800 bg-[#1a1a1a] p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-end">
            <div className="relative flex-1 bg-[#2a2a2a] rounded-lg border border-gray-700">
              <div className="flex items-center p-2">
                <button
                  type="button"
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  <PaperclipIcon className="h-5 w-5" />
                </button>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  rows={1}
                  className="flex-1 mx-2 bg-transparent border-0 focus:ring-0 text-white resize-none placeholder-gray-500"
                  style={{
                    maxHeight: '200px',
                    height: 'auto',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="ml-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              disabled={!inputValue.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <p className="text-xs text-center text-gray-500 mt-2">
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
      
      {/* Modals */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      )}
      
      {isPaymentModalOpen && selectedService && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          service={selectedService}
          user={null}
        />
      )}
    </div>
  );
}
