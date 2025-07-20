-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    job_type VARCHAR NOT NULL,
    contact_number VARCHAR,
    nationality VARCHAR,
    experience TEXT,
    location VARCHAR,
    language VARCHAR,
    availability BOOLEAN DEFAULT true,
    rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_service_providers_updated_at
    BEFORE UPDATE ON service_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Full Text Search
ALTER TABLE service_providers 
ADD COLUMN IF NOT EXISTS search_vector tsvector 
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(job_type, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(experience, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'D')
) STORED;

-- Create search index
CREATE INDEX IF NOT EXISTS service_providers_search_idx ON service_providers USING GIN (search_vector);
