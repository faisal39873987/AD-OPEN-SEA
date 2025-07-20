import axios from 'axios';

/**
 * OpenAI API service for handling communication with OpenAI endpoints
 * Uses environment variables for secure API key management
 */
export interface OpenAIResponse {
  text: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Sends a prompt to OpenAI API and returns the generated response
 * 
 * @param prompt - The user's prompt to send to OpenAI
 * @param model - The model to use, defaults to 'gpt-4o'
 * @param temperature - Controls randomness (0-1), defaults to 0.7
 * @returns Promise with the OpenAI response
 */
export async function sendPromptToOpenAI(
  prompt: string, 
  model: string = 'gpt-4o',
  temperature: number = 0.7
): Promise<OpenAIResponse> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is missing. Please check your environment variables.');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Extract the relevant information from the response
    const responseData = response.data;
    
    return {
      text: responseData.choices[0].message.content,
      model: responseData.model,
      usage: responseData.usage
    };
  } catch (error) {
    // Handle errors gracefully
    if (axios.isAxiosError(error) && error.response) {
      console.error('OpenAI API Error:', error.response.data);
      throw new Error(`OpenAI API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('Error sending prompt to OpenAI:', error);
      throw new Error('Failed to communicate with OpenAI API');
    }
  }
}

/**
 * Stream a prompt to OpenAI API for real-time responses
 * 
 * @param prompt - The user's prompt to send to OpenAI
 * @param onChunk - Callback function to handle each chunk of the streamed response
 * @param model - The model to use, defaults to 'gpt-4o'
 */
export async function streamPromptToOpenAI(
  prompt: string,
  onChunk: (chunk: string) => void,
  model: string = 'gpt-4o'
): Promise<void> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is missing. Please check your environment variables.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        stream: true,
      }),
    });

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsedData = JSON.parse(data);
            const content = parsedData.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (err) {
            console.error('Error parsing stream data:', err);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error streaming from OpenAI:', error);
    throw new Error('Failed to stream response from OpenAI API');
  }
}
