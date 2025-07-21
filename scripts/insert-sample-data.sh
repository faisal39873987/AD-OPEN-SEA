#!/bin/bash
# Script to insert sample service data into Supabase

echo "🔍 Inserting sample service data into Supabase..."

# Check if we have the required environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Error: Missing Supabase environment variables."
  echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
  exit 1
fi

# Sample data insert SQL
SAMPLE_DATA_SQL="
-- First, check if there's already data to avoid duplicate inserts
DO \$\$
BEGIN
  IF (SELECT COUNT(*) FROM services) = 0 THEN
    -- Plumbers
    INSERT INTO services (name, description, phone, category)
    VALUES 
      ('Abu Dhabi Plumbing Experts', 'Professional plumbing services for residential and commercial buildings. Emergency repairs available 24/7.', '+971501234567', 'plumber'),
      ('Quick Fix Plumbing', 'Fast and reliable plumbing repairs and installations. Serving all areas in Abu Dhabi.', '+971502345678', 'plumber'),
      ('Al Reem Plumbing Services', 'Specialized in bathroom and kitchen installations, leak repairs, and drain cleaning.', '+971503456789', 'plumber');
    
    -- Cleaners
    INSERT INTO services (name, description, phone, category)
    VALUES 
      ('Sparkle Home Cleaning', 'Professional home cleaning services. Regular, deep cleaning, and move-in/out services available.', '+971504567890', 'cleaning'),
      ('Crystal Clear Services', 'Premium cleaning for homes and offices with eco-friendly products.', '+971505678901', 'cleaning'),
      ('Reem Island Cleaners', 'Specialized in high-rise apartment cleaning in Reem Island and surrounding areas.', '+971506789012', 'cleaning');
    
    -- AC Repair
    INSERT INTO services (name, description, phone, category)
    VALUES 
      ('Cool Air AC Services', 'Complete air conditioning repair, maintenance and installation services for all AC types.', '+971507890123', 'ac repair'),
      ('Freeze AC Maintenance', '24/7 emergency AC repair and regular maintenance plans. Serving all Abu Dhabi.', '+971508901234', 'ac repair'),
      ('Climate Control Experts', 'Specialized in central AC systems, split units, and advanced cooling solutions.', '+971509012345', 'ac repair');
    
    -- Electricians
    INSERT INTO services (name, description, phone, category)
    VALUES 
      ('Power Pro Electricians', 'Licensed electricians for all electrical installations, repairs and upgrades.', '+971590123456', 'electrician'),
      ('Bright Spark Electric', 'Residential and commercial electrical services with 24/7 emergency support.', '+971591234567', 'electrician'),
      ('Saadiyat Electric Services', 'Specialized in smart home electrical systems and high-end installations.', '+971592345678', 'electrician');
    
    -- Carpenters
    INSERT INTO services (name, description, phone, category)
    VALUES 
      ('Woodcraft Carpenters', 'Custom furniture design and carpentry services for homes and offices.', '+971593456789', 'carpenter'),
      ('Fine Finish Carpentry', 'Specialized in kitchen cabinets, wardrobes, and custom woodwork.', '+971594567890', 'carpenter'),
      ('Al Khalidiyah Carpenters', 'Traditional and modern carpentry with 20+ years of experience in Abu Dhabi.', '+971595678901', 'carpenter');
  END IF;
END \$\$;
"

# Create temporary SQL file
TMP_SQL_FILE=$(mktemp)
echo "$SAMPLE_DATA_SQL" > "$TMP_SQL_FILE"

echo "📊 Inserting sample data if table is empty..."
echo "⏳ Running SQL commands on Supabase..."

# Use curl to execute the SQL against the Supabase REST API
curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"sql\":\"$(cat $TMP_SQL_FILE | tr '\n' ' ')\"}"

# Check if the request was successful
if [ $? -eq 0 ]; then
  echo "✅ Sample data inserted successfully!"
else
  echo "❌ Error: Failed to insert sample data into Supabase."
  echo "Please check your Supabase connection and credentials."
  exit 1
fi

# Clean up the temporary file
rm "$TMP_SQL_FILE"

echo "🎉 Sample data insertion complete! Your services table is populated with example data."
