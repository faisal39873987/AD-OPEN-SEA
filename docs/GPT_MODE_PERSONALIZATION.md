# GPT Mode Personalization

## Overview

The GPT Mode feature allows users to control how the chat interface responds to their queries:

- **GPT Fallback Enabled ✅**: When a search in the Supabase database yields no results, the system will automatically fall back to using OpenAI's GPT to generate a response.
- **Supabase Only 🔒**: Strict mode that only uses verified data from the Supabase database, providing only factual responses from trusted sources.

## Technical Implementation

### Database Schema

The user preference is stored in both the auth.users table and the public.profiles table (if it exists):

```sql
-- In auth.users table
ALTER TABLE auth.users ADD COLUMN gpt_mode_enabled BOOLEAN DEFAULT true;

-- In public.profiles table (if it exists)
ALTER TABLE public.profiles ADD COLUMN gpt_mode_enabled BOOLEAN DEFAULT true;
```

### Row Level Security

To ensure security and proper access control, RLS policies have been implemented:

```sql
-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Allow users to update their own gpt_mode_enabled
CREATE POLICY update_gpt_mode_policy
  ON auth.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### Persistence Logic

- **Logged-in Users**: Setting is stored in Supabase under their user profile
- **Anonymous Users**: Setting is stored in localStorage as a fallback

### Implementation Details

1. **Frontend Component**: `EnhancedChatInterface.tsx` contains the toggle UI and logic
2. **Debounced Updates**: To prevent excessive API calls, updates are debounced by 500ms
3. **API Integration**: The setting is passed to the smart router with each request

## Usage Guide

### For Users

1. Log in to your account to have your GPT mode preference saved across sessions and devices
2. Select your preferred mode from the dropdown in the chat interface header:
   - "GPT Fallback ✅" - For broader responses including AI-generated content
   - "Supabase Only 🔒" - For strictly verified database information

### For Developers

To access a user's GPT mode setting:

```typescript
// From the users table
const { data, error } = await supabase
  .from('users')
  .select('gpt_mode_enabled')
  .eq('id', userId)
  .single();

// Or from the profiles table if you're using it
const { data, error } = await supabase
  .from('profiles')
  .select('gpt_mode_enabled')
  .eq('id', userId)
  .single();
```

## Fallback Mechanism

If there are any issues with accessing or updating the setting in Supabase, the system automatically falls back to using localStorage to ensure uninterrupted user experience.
