'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PaperAirplaneIcon, 
  Bars3Icon, 
  PlusIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon, 
  SparklesIcon,
  ExclamationCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/SimpleThemeContext';
import { useSession } from '@/contexts/AuthContext';
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
const DEFAULT_GPT_MODE = true;

export default function EnhancedChatInterface() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gptMode, setGptMode] = useState<boolean>(DEFAULT_GPT_MODE);
  const [conversations, setConversations] = useState<any[]>([]);
  
  // Use theme context
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading: authLoading, signOut } = useSession();
  
  // Create a reference for message end
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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

  // Fetch user conversations
  useEffect(() => {
    if (user) {
      const fetchConversations = async () => {
        try {
          const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching conversations:', error);
            return;
          }
          
          setConversations(data || []);
        } catch (err) {
          console.error('Failed to fetch conversations:', err);
        }
      };
      
      fetchConversations();
      
      // Also fetch previous messages if there are any conversations
      const fetchMessages = async () => {
        try {
          if (conversations.length > 0) {
            const mostRecentConversation = conversations[0];
            
            const { data, error } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', mostRecentConversation.id)
              .order('created_at', { ascending: true });
              
            if (error) {
              console.error('Error fetching messages:', error);
              return;
            }
            
            if (data && data.length > 0) {
              // Format messages for display
              const formattedMessages = data.map(msg => ({
                role: msg.role,
                content: msg.content
              }));
              
              setMessages(formattedMessages);
            }
          }
        } catch (err) {
          console.error('Failed to fetch messages:', err);
        }
      };
      
      if (conversations.length > 0) {
        fetchMessages();
      }
    }
  }, [user, conversations.length]);
  
  // Function to start a new conversation
  const startNewConversation = () => {
    setMessages([]);
    setInputValue('');
    setError(null);
  };
  
  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = {
      role: 'user',
      content: inputValue.trim()
    };
    
    const userMessageContent = inputValue.trim();
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the AI response
      const aiResponseText = await getAIResponse(userMessageContent);
      
      const aiResponse = {
        role: 'assistant',
        content: aiResponseText
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      
      // If the user is logged in, save the AI response to the database too
      if (user) {
        try {
          const { data: conversationData } = await supabase
            .from('conversations')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (conversationData?.id) {
            // Save the AI response to the database
            await supabase.from('messages').insert({
              conversation_id: conversationData.id,
              content: aiResponseText,
              role: 'assistant'
            });
          }
        } catch (err) {
          console.error('Error saving AI response to database:', err);
        }
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'An error occurred while sending the message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enhanced AI response simulation with API call
  const getAIResponse = async (message: string): Promise<string> => {
    // Try to get a response from our AI service
    try {
      // This would normally be an API call to OpenAI or another AI service
      // For now, we'll simulate a more sophisticated response
      
      // Save the user message and AI response to the database if user is logged in
      if (user) {
        try {
          const { data: conversationData, error: conversationError } = await supabase
            .from('conversations')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          let conversationId = conversationData?.id;
          
          if (!conversationId) {
            // Create a new conversation if none exists
            const { data: newConversation, error: newConvError } = await supabase
              .from('conversations')
              .insert({
                user_id: user.id,
                title: message.slice(0, 50) + (message.length > 50 ? '...' : '')
              })
              .select('id')
              .single();
              
            if (newConvError) {
              console.error('Error creating conversation:', newConvError);
            } else {
              conversationId = newConversation.id;
            }
          }
          
          if (conversationId) {
            // Save the message to the database
            await supabase.from('messages').insert({
              conversation_id: conversationId,
              user_id: user.id,
              content: message,
              role: 'user'
            });
          }
        } catch (err) {
          console.error('Error saving message to database:', err);
        }
      }
      
      // Generate appropriate response based on message content
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        return 'Hello! How can I help you today? I can provide information on services, pricing, or help you find what you need.';
      } else if (message.toLowerCase().includes('name')) {
        return 'I am the AI assistant from AD Pulse, a digital assistant powered by artificial intelligence. I\'m designed to help you find services and answer your questions.';
      } else if (message.toLowerCase().includes('thank')) {
        return 'You\'re welcome! Is there anything else I can help you with? Feel free to ask about any services or assistance you need.';
      } else if (message.toLowerCase().includes('cost') || message.toLowerCase().includes('price') || message.toLowerCase().includes('subscription')) {
        return 'We offer several subscription plans starting at $9.99/month for the basic plan. Premium features are available at $19.99/month. Would you like more details about specific features included in each plan?';
      } else if (message.toLowerCase().includes('service')) {
        return 'Our service provides AI-powered assistance for a variety of tasks. You can find plumbers, electricians, home cleaning services, and many other professional services through our platform. What specific service are you looking for?';
      } else if (message.toLowerCase().includes('plumber') || message.toLowerCase().includes('plumbing')) {
        return 'We have several verified plumbers available. They provide services including fixing leaks, installing fixtures, drain cleaning, and emergency repairs. Would you like me to list some top-rated plumbers in your area?';
      } else if (message.toLowerCase().includes('clean') || message.toLowerCase().includes('cleaning')) {
        return 'Our home cleaning services include regular cleaning, deep cleaning, move-in/move-out cleaning, and specialized services like carpet or window cleaning. Our providers are background-checked and highly rated. Would you like a quote for cleaning services?';
      } else if (message.toLowerCase().includes('ac') || message.toLowerCase().includes('air conditioning')) {
        return 'AC repair and maintenance services start at around $85 for diagnostics. Repairs typically range from $150-$650 depending on the issue. Regular maintenance plans are available starting at $120/year. Would you like me to connect you with a highly-rated AC technician?';
      } else {
        return 'I understand your interest in "' + message + '". Could you provide more details about what you\'re looking for, so I can give you the most relevant information or connect you with the right service provider?';
      }
    } catch (error) {
      console.error('Error in AI response:', error);
      return 'I apologize, but I encountered an issue processing your request. Please try again in a moment.';
    }
  };
  // Render component
  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Sidebar - ChatGPT style */}
      <div className={`w-64 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-3">
          <button
            onClick={startNewConversation}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md border ${
              theme === 'dark' 
                ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-white' 
                : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
            } transition-colors`}
          >
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  } transition-colors truncate`}
                >
                  {conversation.title || 'New conversation'}
                </button>
              ))
            ) : (
              <div className={`text-center py-8 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                No conversations yet
              </div>
            )}
          </div>
        </div>
        
        {/* User Profile at Bottom */}
        <div className={`p-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className={`p-1.5 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <h1 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              ChatGPT
            </h1>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                GPT-4
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            {!user && !authLoading && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="text-center max-w-md">
                <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center mx-auto mb-4`}>
                  <SparklesIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <h2 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  How can I help you today?
                </h2>
              </div>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-2xl w-full">
                {[
                  { icon: '💡', text: 'Get advice on service providers', subtext: 'Find trusted professionals for your needs' },
                  { icon: '📋', text: 'Learn about our services', subtext: 'Discover what we offer' },
                  { icon: '💰', text: 'Check pricing plans', subtext: 'View subscription options' },
                  { icon: '🔧', text: 'Get help with repairs', subtext: 'Connect with repair specialists' }
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(suggestion.text)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      theme === 'dark' 
                        ? 'border-gray-700 hover:bg-gray-800 bg-gray-900' 
                        : 'border-gray-200 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{suggestion.icon}</span>
                      <div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {suggestion.text}
                        </div>
                        <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {suggestion.subtext}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`py-6 px-4 ${index % 2 === 1 ? (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50') : ''}`}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : theme === 'dark' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {msg.role === 'user' ? 
                          user?.email?.[0].toUpperCase() || 'U' : 
                          '🤖'
                        }
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {msg.role === 'user' ? 'You' : 'ChatGPT'}
                      </div>
                      <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className={`py-6 px-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
                      }`}>
                        🤖
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        ChatGPT
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} p-4`}>
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative">
              <div className={`relative rounded-xl border ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-800' 
                  : 'border-gray-300 bg-white'
              } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message ChatGPT..."
                  rows={1}
                  className={`w-full px-4 py-3 pr-12 rounded-xl resize-none focus:outline-none ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-white placeholder-gray-400' 
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    isLoading || !inputValue.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </form>
            
            <p className={`text-xs text-center mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              ChatGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            mode={authMode}
            onModeChange={(mode) => setAuthMode(mode)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
