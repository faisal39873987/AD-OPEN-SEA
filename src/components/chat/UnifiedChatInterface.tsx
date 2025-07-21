'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, User, Bot, Plus, Menu, X, ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  icon: string;
}

interface UnifiedChatInterfaceProps {
  user: SupabaseUser | null;
  onAuthClick: () => void;
  onSubscriptionClick: () => void;
}

const UnifiedChatInterface: React.FC<UnifiedChatInterfaceProps> = ({
  user,
  onAuthClick,
  onSubscriptionClick,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Load services from Supabase
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error loading services:', error);
          return;
        }
        
        setServices(data || []);
        setFilteredServices(data || []);
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };

    loadServices();
  }, [supabase]);

  // Filter services based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: 'Welcome to AD OPEN SEA Assistant! How can I help you today?',
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowSidebar(false);
    
    // Add service selection message
    const serviceMessage: Message = {
      id: Date.now().toString(),
      content: `You selected: ${service.name}`,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, serviceMessage]);
    
    // Assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Great! You've selected ${service.name}. ${service.description}. How can I help you with this service?`,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Save user message to database if user is logged in
      if (user) {
        await supabase.from('user_requests').insert([
          {
            user_id: user.id,
            message: input,
            service_id: selectedService?.id || null,
            created_at: new Date().toISOString(),
          },
        ]);
      }

      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        const responses = [
          'Thank you for your message. I will help you as best I can.',
          'That is an excellent question! Let me think about the best way to help you.',
          'I understand what you need. Can you give me more details?',
          'I can help you with this. Would you like to start with an action plan?',
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          sender: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const categories = [...new Set(services.map(service => service.category))];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-80 bg-gray-800 border-r border-gray-700 lg:relative lg:translate-x-0"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Services</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for a service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map(category => (
                  <div key={category} className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">{category}</h3>
                    {filteredServices
                      .filter(service => service.category === category)
                      .map(service => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service)}
                          className={`w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                            selectedService?.id === service.id ? 'bg-blue-600' : 'bg-gray-750'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-gray-400 line-clamp-2">{service.description}</div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold">AD OPEN SEA Assistant</h1>
            {selectedService && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">•</span>
                <span className="text-blue-400">{selectedService.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {user ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={onSubscriptionClick}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
                >
                  Subscription
                </button>
                <div className="flex items-center space-x-2">
                  <User size={20} />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  {message.sender === 'assistant' && (
                    <Bot size={20} className="mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <User size={20} className="mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Bot size={20} />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChatInterface;
