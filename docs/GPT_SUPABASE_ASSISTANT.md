# GPT-Supabase Intelligent Assistant

## Introduction

The GPT-Supabase Intelligent Assistant is a key feature of AD Pulse that combines the power of database lookups with artificial intelligence. This smart assistant first searches for information in the Supabase database and falls back to OpenAI's GPT when necessary.

## Architecture

The assistant is built on a 4-phase implementation:

1. **Supabase API Layer** - Direct access to service data
2. **Smart Router** - Decision engine to choose between Supabase or GPT
3. **Chat Interface Integration** - Frontend interaction
4. **Deployment System** - Automated deployment with GitHub Actions

## Components

### 1. Supabase Integration

- **`/src/lib/supabase/index.ts`** - Central Supabase client
- **`/src/lib/supabase/searchServices.ts`** - Service search functionality
- **Database Tables:**
  - `services` - Stores service provider information
  - `chat_log` - Records all chat interactions

### 2. Smart Router

- **`/src/lib/supabase/router.ts`** - Core routing logic
- **`/src/lib/supabase/openai.ts`** - OpenAI integration
- **`/src/lib/supabase/chatService.ts`** - Chat session management

### 3. API Endpoint

- **`/src/app/api/chat/route.ts`** - Handles chat requests, integrates with the smart router

## How It Works

1. User sends a message through the chat interface
2. The message is sent to the chat API endpoint
3. The smart router processes the message:
   - First attempts to find matching services in Supabase
   - If services are found, returns them with a helpful message
   - If no relevant services are found, forwards the query to OpenAI's GPT
4. The response is returned to the user in a conversational format
5. All interactions are logged in the `chat_log` table for future analysis

## Test Queries

To see the smart routing in action, try these test queries:

- **"Looking for a plumber"** - Should return plumbing services from Supabase
- **"Cleaning in Reem"** - Should return cleaning services with Reem location
- **"I want AC repair"** - Should return AC repair services
- **"What's the weather like today?"** - Should fall back to GPT (no matching services)

## Deployment

The assistant is automatically deployed with the rest of the application. See `DEPLOYMENT_CHECKLIST.md` for the complete deployment process.
