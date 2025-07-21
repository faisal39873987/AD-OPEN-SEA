-- Create service_providers table

CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(3,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  hourly_rate NUMERIC(10,2),
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT TRUE,
  profile_image TEXT,
  verified BOOLEAN DEFAULT FALSE,
  response_time TEXT DEFAULT '< 24 hours',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add some sample data
INSERT INTO service_providers (name, category, rating, total_reviews, hourly_rate, location, skills, available, verified, response_time, description)
VALUES 
  ('Ahmed Al Mansouri', 'Home Cleaning', 4.9, 127, 65, 'Abu Dhabi Marina', ARRAY['Deep Cleaning', 'Regular Maintenance', 'Eco-friendly'], TRUE, TRUE, '< 1 hour', 'Professional cleaning specialist with 8+ years experience. Eco-friendly products and flexible scheduling.'),
  ('Maria Santos', 'Home Cleaning', 4.8, 89, 55, 'Al Khalidiyah', ARRAY['House Cleaning', 'Office Cleaning', 'Move-in/out'], TRUE, TRUE, '< 2 hours', 'Reliable and thorough cleaning service with attention to detail. Available weekends.'),
  ('Fatima Al Hashemi', 'Personal Trainer', 5.0, 64, 120, 'Yas Island', ARRAY['Weight Loss', 'Strength Training', 'Nutrition'], TRUE, TRUE, '< 1 hour', 'Certified personal trainer specializing in weight loss and strength training. Customized fitness plans and nutrition guidance.'),
  ('Mohammed Al Ali', 'Driver', 4.6, 215, 45, 'Al Reem Island', ARRAY['City Tours', 'Airport Transfer', 'Daily Commute'], TRUE, FALSE, '< 3 hours', 'Experienced driver with excellent knowledge of Abu Dhabi and Dubai. Safe driving record and punctual service.');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_service_providers_category ON service_providers(category);
CREATE INDEX IF NOT EXISTS idx_service_providers_rating ON service_providers(rating);
