'use client'

import { useState, useEffect, useRef } from 'react'
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import useChatAI from '../../hooks/useChatAI'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { sendMessage } = useChatAI()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await sendMessage(inputMessage.trim())
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was a connection error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">AD Pulse</h1>
          <UserCircleIcon className="w-8 h-8 text-gray-600" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-6">
            {/* Service Icon */}
            <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-8">
              <img 
                src="/logos/logo-light.png" 
                alt="AD Pulse Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                AD Pulse
              </h2>
              <p className="text-gray-600 mb-8">
                Find trusted service providers in Abu Dhabi. From personal training to home cleaning, we connect you with the best professionals.
              </p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-8">
              <button 
                onClick={() => setInputMessage("I need a personal trainer in Abu Dhabi")}
                className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Need a personal trainer?
                </div>
                <div className="text-xs text-gray-500">
                  Find certified fitness professionals in Abu Dhabi
                </div>
              </button>
              
              <button 
                onClick={() => setInputMessage("I'm looking for home cleaning service")}
                className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Professional home cleaning
                </div>
                <div className="text-xs text-gray-500">
                  Reliable cleaning services for your home
                </div>
              </button>
              
              <button 
                onClick={() => setInputMessage("I want to book an appointment at a beauty clinic")}
                className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Beauty & skincare services
                </div>
                <div className="text-xs text-gray-500">
                  Book appointments at top beauty clinics
                </div>
              </button>
              
              <button 
                onClick={() => setInputMessage("Show me all available services in Abu Dhabi")}
                className="p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Explore all services
                </div>
                <div className="text-xs text-gray-500">
                  Browse our complete service directory
                </div>
              </button>
            </div>

            {/* Bottom Tags */}
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <span className="text-blue-500">🏋️</span>
                <span className="text-gray-600">Fitness</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-green-500">🏠</span>
                <span className="text-gray-600">Cleaning</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-pink-500">💄</span>
                <span className="text-gray-600">Beauty</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-purple-500">🔍</span>
                <span className="text-gray-600">Explore</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">U</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AI</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <span className="text-sm">👍</span>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <span className="text-sm">👎</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex space-x-1 py-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent bg-white"
              rows={1}
              style={{ minHeight: '52px', maxHeight: '120px' }}
              disabled={isLoading}
            />
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              {/* Plus Button */}
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <span className="text-lg">+</span>
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-black text-white p-2 rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center mt-2">
            AD Pulse can help you find services. Check provider details before booking.
          </div>
        </div>
      </div>
    </div>
  )
}
