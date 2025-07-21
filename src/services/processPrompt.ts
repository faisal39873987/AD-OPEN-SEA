import { sendPromptToOpenAI } from './openaiService';
import { saveStructuredData } from './supabaseService';

/**
 * Process a user prompt through OpenAI and save structured data to Supabase
 * 
 * @param userInput - Raw text input from the user
 * @returns Promise with the processed and saved data
 */
export async function processAndSavePrompt(userInput: string) {
  try {
    // Step 1: Process the user input with OpenAI to get structured data
    const systemPrompt = `
      You are a helpful assistant that converts user requests into structured JSON data.
      Extract key information from the user's input and format it into a valid JSON object
      with the following structure:
      {
        "title": "Service title",
        "description": "Detailed description",
        "price": number,
        "category": "Service category",
        "provider": "Service provider name",
        "contact": "Contact information",
        "tags": ["tag1", "tag2", ...]
      }
    `;
    
    // Combine system instructions with user input
    const fullPrompt = `${systemPrompt}\n\nUser Input: ${userInput}\n\nJSON Output:`;
    
    // Send to OpenAI for processing
    const openaiResponse = await sendPromptToOpenAI(fullPrompt, 'gpt-4o', 0.2);
    
    // Step 2: Parse the response text as JSON
    let structuredData;
    try {
      // Extract JSON from response if it's wrapped in markdown code blocks
      const jsonText = openaiResponse.text.replace(/```json|```/g, '').trim();
      structuredData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing OpenAI response as JSON:', parseError);
      throw new Error('Failed to parse structured data from OpenAI response');
    }
    
    // Step 3: Save the structured data to Supabase
    const savedData = await saveStructuredData(structuredData);
    
    // Step 4: Return the saved data with processing info
    return {
      original: userInput,
      processed: structuredData,
      saved: savedData,
      model: openaiResponse.model,
      usage: openaiResponse.usage
    };
  } catch (error) {
    console.error('Error in processAndSavePrompt:', error);
    throw new Error(`Failed to process and save prompt: ${(error as Error).message}`);
  }
}

/**
 * Process a user prompt through OpenAI without saving to database
 * Useful for previewing the structured data before saving
 * 
 * @param userInput - Raw text input from the user
 * @returns Promise with the processed data
 */
export async function processPromptOnly(userInput: string) {
  try {
    const systemPrompt = `
      You are a helpful assistant that converts user requests into structured JSON data.
      Extract key information from the user's input and format it into a valid JSON object
      with the following structure:
      {
        "title": "Service title",
        "description": "Detailed description",
        "price": number,
        "category": "Service category",
        "provider": "Service provider name",
        "contact": "Contact information",
        "tags": ["tag1", "tag2", ...]
      }
    `;
    
    const fullPrompt = `${systemPrompt}\n\nUser Input: ${userInput}\n\nJSON Output:`;
    
    const openaiResponse = await sendPromptToOpenAI(fullPrompt, 'gpt-4o', 0.2);
    
    let structuredData;
    try {
      const jsonText = openaiResponse.text.replace(/```json|```/g, '').trim();
      structuredData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing OpenAI response as JSON:', parseError);
      throw new Error('Failed to parse structured data from OpenAI response');
    }
    
    return {
      original: userInput,
      processed: structuredData,
      model: openaiResponse.model,
      usage: openaiResponse.usage
    };
  } catch (error) {
    console.error('Error in processPromptOnly:', error);
    throw new Error(`Failed to process prompt: ${(error as Error).message}`);
  }
}
