'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Import components dynamically to avoid hydration errors
const ThemeProvider = dynamic(() => import('@/contexts/theme-provider').then(mod => mod.ThemeProvider), { ssr: false });
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const Chat = dynamic(() => import('@/components/Chat'), { ssr: false });
const LoginModal = dynamic(() => import('@/components/LoginModal'), { ssr: false });
const SettingsModal = dynamic(() => import('@/components/SettingsModal'), { ssr: false });

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessageDate: Date;
  messages: Message[];
}

export default function Home() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  
  // Load conversations from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConversations = localStorage.getItem('conversations');
      if (savedConversations) {
        try {
          const parsedConversations = JSON.parse(savedConversations).map((conv: any) => ({
            ...conv,
            lastMessageDate: new Date(conv.lastMessageDate),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
          setConversations(parsedConversations);
          
          // Set the most recent conversation as active if available
          if (parsedConversations.length > 0) {
            const mostRecent = parsedConversations.reduce((prev: any, current: any) => 
              new Date(current.lastMessageDate) > new Date(prev.lastMessageDate) ? current : prev
            );
            setActiveConversationId(mostRecent.id);
          }
        } catch (error) {
          console.error("Failed to parse conversations from localStorage", error);
        }
      }
      
      // Check for user in localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
    }
  }, []);

  // Save conversations to localStorage when updated
  useEffect(() => {
    if (typeof window !== 'undefined' && conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const handleNewChat = () => {
    const newConversationId = uuidv4();
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'محادثة جديدة',
      lastMessageDate: new Date(),
      messages: [],
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversationId);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      handleNewChat();
      return;
    }
    
    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    
    // Update the conversation with the user message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversationId) {
        // Update conversation title if it's the first message
        const title = conv.messages.length === 0 ? 
          (content.length > 30 ? content.substring(0, 30) + '...' : content) : 
          conv.title;
        
        return {
          ...conv,
          title,
          lastMessageDate: new Date(),
          messages: [...conv.messages, userMessage],
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    // Simulate AI response (replace with actual API call in production)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: uuidv4(),
        content: 'شكراً على رسالتك! هذا رد تجريبي من AD Pulse Assistant.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      const conversationsWithResponse = updatedConversations.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessageDate: new Date(),
            messages: [...conv.messages, assistantMessage],
          };
        }
        return conv;
      });
      
      setConversations(conversationsWithResponse);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = async (email: string, password: string) => {
    // Simulate login (replace with actual auth in production)
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          const userData = {
            name: 'مستخدم تجريبي',
            email,
            avatar: 'https://avatars.githubusercontent.com/u/12345678?v=4',
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  const activeMessages = activeConversation?.messages || [];
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId || undefined}
          onNewChat={handleNewChat}
          onSelectConversation={(id) => setActiveConversationId(id)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          onUpgrade={handleUpgrade}
          user={user || undefined}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:hidden">
          <div className="flex items-center">
            <button
              onClick={() => document.getElementById('mobile-sidebar')?.classList.toggle('hidden')}
              className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">AD Pulse</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile Sidebar */}
        <div id="mobile-sidebar" className="fixed inset-0 z-50 hidden">
          <div 
            onClick={() => document.getElementById('mobile-sidebar')?.classList.add('hidden')}
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
          ></div>
          <div className="absolute bottom-0 left-0 top-0 w-64 bg-white shadow-xl dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-y-auto">
              <Sidebar
                conversations={conversations}
                activeConversationId={activeConversationId || undefined}
                onNewChat={handleNewChat}
                onSelectConversation={(id) => {
                  setActiveConversationId(id);
                  document.getElementById('mobile-sidebar')?.classList.add('hidden');
                }}
                onOpenSettings={() => {
                  setIsSettingsOpen(true);
                  document.getElementById('mobile-sidebar')?.classList.add('hidden');
                }}
                onLogout={handleLogout}
                onUpgrade={handleUpgrade}
                user={user || undefined}
              />
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="flex-1 bg-white dark:bg-gray-900">
          <Chat
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onRegister={() => {
          // Handle registration
          setIsLoginOpen(false);
        }}
        onForgotPassword={() => {
          // Handle forgot password
          setIsLoginOpen(false);
        }}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
