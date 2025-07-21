'use client';

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatInput from './ChatInput';
import ChatMessage, { Message } from './ChatMessage';
import { ChatService } from '@/lib/services/chatService';

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'مرحباً بك في مساعد AD PLUS! كيف يمكنني مساعدتك اليوم؟',
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
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    // Add temporary assistant message with loading state
    const tempAssistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      loading: true,
    };
    
    setMessages((prev) => [...prev, userMessage, tempAssistantMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Process the message using our service
      const response = await ChatService.processMessage(userMessage.content);
      
      // Update assistant message with the response
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === tempAssistantMessage.id 
            ? {
                ...msg,
                content: response.content,
                serviceResults: response.serviceResults,
                loading: false,
              } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Update assistant message with error
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === tempAssistantMessage.id 
            ? {
                ...msg,
                content: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
                loading: false,
              } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
