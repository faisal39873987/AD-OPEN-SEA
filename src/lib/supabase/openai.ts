import { ChatMessage } from './router';

/**
 * Get a response from OpenAI based on the user's message and chat history
 * @param message User's current message
 * @param chatHistory Previous messages in the conversation
 * @returns OpenAI generated response
 */
export async function getOpenAIResponse(
  message: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    // Prepare the messages array for the API request
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant for AD Pulse, a service marketplace platform. You can provide information about services, help users find what they need, and answer general questions.'
      },
      ...chatHistory,
      { role: 'user', content: message }
    ];
    
    // Make the API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
  } catch (error) {
    console.error('Error in getOpenAIResponse:', error);
    return 'I apologize, but I encountered an error while processing your request. Please try again later.';
  }
}

/**
 * Generates embeddings for a text using OpenAI's embedding API
 * @param text Text to generate embeddings for
 * @returns Array of embeddings or null if error
 */
export async function generateEmbeddings(text: string): Promise<number[] | null> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.data[0]?.embedding || null;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return null;
  }
}
