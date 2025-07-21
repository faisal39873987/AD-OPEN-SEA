-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table for vector storage
CREATE TABLE IF NOT EXISTS embeddings (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for vector similarity search
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx 
ON embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT REFERENCES services(id),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  location TEXT,
  location_ar TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  price_range TEXT,
  price_range_ar TEXT,
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial services data
INSERT INTO services (id, name, name_ar, description, description_ar, category, image_url) VALUES
('personal-trainer', 'Personal Trainer', 'مدرب شخصي', 'Professional fitness training services', 'خدمات التدريب الرياضي الاحترافي', 'fitness', '/images/personal-trainer.jpg'),
('home-cleaning', 'Home Cleaning', 'تنظيف منازل', 'Professional home cleaning services', 'خدمات تنظيف المنازل الاحترافية', 'cleaning', '/images/home-cleaning.jpg'),
('beauty-clinic', 'Beauty Clinic', 'عيادة تجميل', 'Beauty and skincare services', 'خدمات التجميل والعناية بالبشرة', 'beauty', '/images/beauty-clinic.jpg'),
('transportation', 'Transportation', 'النقل والمواصلات', 'Transport and taxi services', 'خدمات النقل والتاكسي', 'transport', '/images/transportation.jpg'),
('property-rental', 'Property Rental', 'تأجير العقارات', 'Property rental and real estate services', 'خدمات تأجير العقارات والعقارات', 'real-estate', '/images/property-rental.jpg'),
('pet-care', 'Pet Care', 'رعاية الحيوانات', 'Pet care and veterinary services', 'خدمات رعاية الحيوانات والطب البيطري', 'pets', '/images/pet-care.jpg'),
('baby-world', 'Baby World', 'عالم الأطفال', 'Childcare and babysitting services', 'خدمات رعاية الأطفال والمربيات', 'childcare', '/images/baby-world.jpg')
ON CONFLICT (id) DO NOTHING;

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION search_vectors(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    embeddings.id,
    embeddings.content,
    embeddings.metadata,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Enable Row Level Security
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON embeddings FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON services FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON providers FOR SELECT USING (true);

-- Create policies for authenticated insert/update
CREATE POLICY "Enable insert for authenticated users only" ON embeddings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users only" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users only" ON providers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
