-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    job TEXT NOT NULL,
    phone TEXT,
    nationality TEXT,
    experience TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_requests table
CREATE TABLE IF NOT EXISTS chat_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_question TEXT NOT NULL,
    ai_response TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add search capabilities for service_providers
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('arabic', coalesce(name, '')) || 
        to_tsvector('arabic', coalesce(job, '')) || 
        to_tsvector('arabic', coalesce(nationality, '')) || 
        to_tsvector('arabic', coalesce(experience, '')) || 
        to_tsvector('arabic', coalesce(details, '')), 'A')
    ) STORED;

-- Create search index
CREATE INDEX IF NOT EXISTS service_providers_search_idx ON service_providers USING GIN (search_vector);
