'use client';

import React from 'react';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Service } from '@/lib/types/database';
import { ServiceResults } from './ServiceDisplay';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  loading?: boolean;
  serviceResults?: Service[];
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  // Format timestamp
  const formattedTime = new Intl.DateTimeFormat('ar-AE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${message.role}`}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex max-w-[85%]`}>
        {!isUser && (
          <div className="flex-shrink-0 mr-3 mt-1">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
          </div>
        )}
        
        <div className="flex flex-col">
          <div className={`px-4 py-3 rounded-lg ${
            isUser 
              ? 'bg-black text-white' 
              : 'bg-gray-100 text-black'
          }`}>
          {message.loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          ) : (
            <>
              <p dir="auto">{message.content}</p>
              
              {/* Service results if any */}
              {message.serviceResults && message.serviceResults.length > 0 && (
                <div className="mt-3">
                  <ServiceResults services={message.serviceResults} />
                </div>
              )}
            </>
          )}
          </div>
          
          <span className="text-xs text-gray-500 mt-1 mx-1">
            {formattedTime}
          </span>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0 ml-3 mt-1">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
