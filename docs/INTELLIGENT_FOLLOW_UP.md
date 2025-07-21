# Intelligent Follow-Up Questions

This document describes the enhanced intelligence of the AD Pulse assistant, which now asks follow-up questions to collect better context when initial queries lack specific information.

## Overview

The AD Pulse assistant has been upgraded to:

1. Recognize when a user query lacks critical information (location or service type)
2. Ask targeted follow-up questions to gather the missing information
3. Store and utilize this context in future interactions
4. Provide more accurate service recommendations based on the collected context

## Implementation Details

### Sessions Table

A new `sessions` table has been added to the database to track:

- User location preferences
- Service type interests
- User intent

This allows the assistant to remember important context across the conversation.

### Context Extraction

The system now extracts:

- **Locations**: Recognizes Abu Dhabi areas mentioned in messages
- **Service Types**: Identifies service categories from user queries
- **Intent**: (Future enhancement) Will identify whether users want to book, compare, or just get information

### Follow-Up Question Logic

When a user asks about a service but doesn't specify a location:
```
User: "I need an electrician"
Assistant: "I'd like to help you find that service. Could you please tell me which area in Abu Dhabi you're located in? This will help me find providers that serve your location."
```

When a user mentions a location but not a specific service:
```
User: "I need services in Al Reem"
Assistant: "I'd be happy to help you find services in that area. Could you please specify what type of service you're looking for?"
```

### Database Design

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_id UUID NOT NULL,
  service_type TEXT,
  location TEXT,
  user_intent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

1. Run the sessions table setup script:
   ```bash
   ./scripts/setup-sessions-table.sh
   ```

2. Restart your application to apply the changes

## Testing

Try these test queries to see the follow-up questions in action:

1. **Missing location**:
   - "I need a plumber"
   - Expected: Assistant asks for your location in Abu Dhabi

2. **Missing service type**:
   - "I'm in Al Reem"
   - Expected: Assistant asks what service you're looking for

3. **Complete query**:
   - "I need a plumber in Al Reem"
   - Expected: Assistant shows matching services or indicates none available

4. **Context retention**:
   - First say: "I'm in Yas Island"
   - Then say: "I need AC repair"
   - Expected: Assistant remembers you're in Yas Island and finds AC services there

## Future Enhancements

- Use machine learning to better identify user intent
- Personalize recommendations based on previous service preferences
- Implement location-based service ranking
