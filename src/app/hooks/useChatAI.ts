'use client'

import { useState, useCallback } from 'react'

interface UseChatAIReturn {
  sendMessage: (message: string) => Promise<string>
  isLoading: boolean
}

export function useChatAI(): UseChatAIReturn {
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: message }
          ]
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || 'Sorry, I couldn\'t process your request. Please try again.'
      
    } catch (error) {
      console.error('Error in sendMessage:', error)
      
      // Fallback responses
      if (message.includes('trainer') || message.includes('fitness') || message.includes('gym')) {
        return 'I can help you find a personal trainer in Abu Dhabi. We have qualified and certified trainers in various sports specializations.'
      } else if (message.includes('cleaning') || message.includes('clean')) {
        return 'We have professional home cleaning services in Abu Dhabi with the best prices and highest quality standards.'
      } else if (message.includes('beauty') || message.includes('clinic')) {
        return 'Advanced beauty clinics are available in Abu Dhabi with qualified doctors and the latest technologies.'
      } else {
        return 'Sorry, there was a connection error. You can inquire about any of our services: Personal Trainer, Home Cleaning, Beauty Clinic, Transportation, Property Rental, Pet Care, or Child Services.'
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { sendMessage, isLoading }
}
