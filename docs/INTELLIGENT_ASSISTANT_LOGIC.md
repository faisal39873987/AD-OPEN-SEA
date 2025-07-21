# Intelligent Assistant Logic

This document defines the behavior and flow logic for the AD Pulse Intelligent Assistant.

## Core Logic Flow

```
User Query → API Endpoint → Smart Router → Database or AI → Response
```

## Detailed Process

1. **User Submits Query**
   - User types a message in the chat interface
   - Client sends a POST request to `/api/chat` endpoint

2. **API Processing**
   - Extract query text and user information
   - Format query for processing

3. **Service Search**
   - Query is passed to `searchServices()` function
   - Function performs full-text search on the "services" table in Supabase
   - Search uses multiple methods:
     1. Full-text search with text_search() on "description" column
     2. Fallback to ILIKE pattern matching on "name" and "description"
     3. Final fallback to category matching

4. **Decision Routing**
   - If matching services found:
     - Return JSON array with service data
     - Format includes: id, name, description, category, phone
     - Response marked with source: "supabase"
   - If no matching services found:
     - Forward query to OpenAI GPT
     - Return AI-generated helpful response
     - Response marked with source: "openai"

5. **Response Handling**
   - Format response for the user
   - Include any matched services in a structured format
   - For OpenAI responses, ensure they're conversational and helpful

6. **Logging**
   - All interactions are stored in "chat_log" table
   - Log includes:
     - User ID (anonymous if not logged in)
     - Original query text
     - Response text
     - Response source ("supabase" or "openai")
     - Timestamp

## Logic Pseudocode

```typescript
async function processQuery(query: string, userId: string): Promise<Response> {
  // Step 1: Search services in Supabase
  const services = await searchServices(query);
  
  // Step 2: Determine response source
  if (services && services.length > 0) {
    // Services found, use Supabase data
    const response = formatServiceResponse(services, query);
    
    // Log the interaction
    await logChatSession(userId, query, response.message, "supabase");
    
    return {
      source: "supabase",
      message: response.message,
      services: services
    };
  } else {
    // No services found, use OpenAI
    const aiResponse = await getOpenAIResponse(query);
    
    // Log the interaction
    await logChatSession(userId, query, aiResponse, "openai");
    
    return {
      source: "openai",
      message: aiResponse,
      services: []
    };
  }
}
```

## Example Interactions

### Example 1: Matching Service Query
- User query: "Looking for a plumber in Abu Dhabi"
- System: Searches Supabase "services" table
- Result: Finds matching plumbing services
- Response: Returns service list with contact information
- Source: "supabase"

### Example 2: Non-Matching Query
- User query: "What's the weather like today?"
- System: Searches Supabase "services" table
- Result: No matching services found
- System: Forwards query to OpenAI GPT
- Response: "I don't have real-time weather information, but I can help you find weather services..."
- Source: "openai"

## Error Handling

- Database connection errors: Fall back to OpenAI
- OpenAI API errors: Return friendly error message
- Rate limiting: Implement exponential backoff
- Invalid queries: Handle with appropriate prompts

This behavior ensures that users always get a helpful response, prioritizing actual service data when available and using AI as a fallback.
