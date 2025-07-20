'use client'

import { useState } from 'react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function useChatAI() {
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message: string, conversationHistory: ChatMessage[] = []): Promise<string> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: conversationHistory.slice(-10) // Keep last 10 messages for context
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      return data.message || 'Sorry, I could not process your request.'
    } catch (error) {
      console.error('AI Chat Error:', error)
      return 'I apologize, but I\'m having trouble connecting right now. Please try again.'
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendMessage,
    isLoading
  }
}
