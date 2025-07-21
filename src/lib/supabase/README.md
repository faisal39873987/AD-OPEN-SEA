# GPT-Supabase Intelligent Assistant

This module provides a smart assistant that connects Supabase database with OpenAI's GPT to provide intelligent responses to user queries.

## Architecture

The GPT-Supabase Intelligent Assistant consists of the following components:

1. **Supabase Data Layer** - Provides access to service data stored in Supabase
2. **OpenAI Integration** - Fallback for when Supabase doesn't have relevant answers
3. **Smart Router** - Decides whether to use Supabase or OpenAI based on the query
4. **Chat Service** - Manages chat sessions and message history

## Setup

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### Supabase Schema

The assistant requires the following tables in your Supabase database:

- `services` - Stores service provider information
- `chat_sessions` - Tracks chat conversations
- `chat_messages` - Stores individual messages in a conversation

You can find the SQL schema in the `database` directory.

## Usage

### Basic Usage

```typescript
import { routeMessage } from '@/lib/supabase/router';

// Process a user message
const response = await routeMessage('I need a plumber in Abu Dhabi');

console.log(response.source); // 'supabase' or 'openai'
console.log(response.message.content); // The assistant's response
console.log(response.services); // Array of services if any were found
```

### Managing Chat Sessions

```typescript
import { 
  createChatSession, 
  processUserMessage, 
  getChatSessions 
} from '@/lib/supabase/chatService';

// Create a new chat session
const session = await createChatSession('user-123', 'Plumbing Help');

// Process a message in the session
const response = await processUserMessage(
  session.id,
  'I need help with a leaky faucet',
  [] // Previous messages if any
);

// Get all sessions for a user
const sessions = await getChatSessions('user-123');
```

## Customization

### Adding New Service Categories

To add new service categories, update the Supabase database with new service records.

### Tuning the OpenAI Model

You can customize the OpenAI model parameters in `openai.ts`:

```typescript
// Example: Change the model or parameters
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  // ...
  body: JSON.stringify({
    model: 'gpt-4', // Use a different model
    messages,
    temperature: 0.5, // Lower temperature for more deterministic responses
    max_tokens: 1000 // Increase token limit for longer responses
  })
});
```

## Deployment

The assistant is automatically deployed through GitHub Actions when changes are pushed to the main branch. See `DEPLOYMENT.md` for more details.

## Troubleshooting

- **No Services Found**: Ensure your Supabase database has services data loaded
- **OpenAI Not Responding**: Check your API key and request format
- **Slow Responses**: Consider adding indexes to your Supabase tables
