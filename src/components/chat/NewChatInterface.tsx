'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Service, SERVICE_CATEGORIES } from '@/types/service';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  loading?: boolean;
  services?: Service[];
}

interface ChatInterfaceProps {
  user: SupabaseUser | null;
  services: Service[];
  onAuthRequired: () => void;
  onServiceSelect: (service: Service) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  user,
  services,
  onAuthRequired,
  onServiceSelect
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm the AD PLUS Assistant. I can help you find services in Abu Dhabi. You can ask me about:

🏋️‍♂️ Personal trainers
⛵ Yacht rentals  
🏠 Apartment rentals
✨ Beauty clinics
👶 Kids services
🧹 Housekeeping

What service are you looking for today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Search for relevant services
      const relevantServices = searchServices(inputValue);
      
      let response = '';
      let foundServices: Service[] = [];

      if (relevantServices.length > 0) {
        foundServices = relevantServices;
        response = `I found ${relevantServices.length} service${relevantServices.length > 1 ? 's' : ''} that match your request:`;
      } else {
        response = `I couldn't find any services matching your request in our database. You can get comprehensive help from our GPT Assistant.`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        services: foundServices,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save user request to database
      if (user) {
        await supabase
          .from('user_requests')
          .insert({
            user_id: user.id,
            user_input: inputValue,
            response: response,
            source: relevantServices.length > 0 ? 'supabase' : 'gpt'
          });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchServices = (query: string): Service[] => {
    const lowerQuery = query.toLowerCase();
    return services.filter(service => 
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery) ||
      service.category.toLowerCase().includes(lowerQuery) ||
      service.location.toLowerCase().includes(lowerQuery)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openGPTAssistant = () => {
    window.open(process.env.NEXT_PUBLIC_GPT_ASSISTANT_URL, '_blank');
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Personal trainers': '🏋️‍♂️',
      'Yacht rentals': '⛵',
      'Apartment rentals': '🏠',
      'Beauty clinics': '✨',
      'Kids services': '👶',
      'Housekeeping': '🧹'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Service Categories Quick Access */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex flex-wrap gap-2 justify-center">
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setInputValue(`Tell me about ${category.toLowerCase()}`)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>{getCategoryIcon(category)}</span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gray-700'
                }`}>
                  {message.role === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`px-4 py-2 rounded-lg max-w-full ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-white'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  
                  {/* Services Display */}
                  {message.services && message.services.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.services.map((service) => (
                        <div key={service.id} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-lg">{getCategoryIcon(service.category)}</span>
                                <h4 className="font-semibold text-white">{service.name}</h4>
                              </div>
                              <p className="text-gray-300 text-sm">{service.description}</p>
                            </div>
                            <span className="text-green-400 font-bold text-lg ml-2">{service.price} AED</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              <span>⭐ {service.rating}/5</span>
                              <span>📍 {service.location}</span>
                            </div>
                            <button
                              onClick={() => onServiceSelect(service)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* GPT Assistant Fallback */}
                  {message.role === 'assistant' && (!message.services || message.services.length === 0) && (
                    <div className="mt-3">
                      <button
                        onClick={openGPTAssistant}
                        className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        Ask GPT Assistant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                style={{
                  minHeight: '52px',
                  maxHeight: '120px',
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`p-3 rounded-lg transition-colors ${
                inputValue.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
