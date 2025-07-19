-- AD PLUS Assistant - Database Verification SQL
-- Run this after migration to verify tables were created correctly

-- Step 1: Check which tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Step 2: Verify old tables were deleted
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages' AND table_schema = 'public')
    THEN 'ERROR: messages table still exists'
    ELSE 'OK: messages table deleted'
  END AS messages_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription' AND table_schema = 'public')
    THEN 'ERROR: subscription table still exists'
    ELSE 'OK: subscription table deleted'
  END AS subscription_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'schema_migrations' AND table_schema = 'public')
    THEN 'ERROR: schema_migrations table still exists'
    ELSE 'OK: schema_migrations table deleted'
  END AS migrations_status;

-- Step 3: Verify new tables were created
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public')
    THEN 'OK: services table exists'
    ELSE 'ERROR: services table does not exist'
  END AS services_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_requests' AND table_schema = 'public')
    THEN 'OK: user_requests table exists'
    ELSE 'ERROR: user_requests table does not exist'
  END AS user_requests_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_feedback' AND table_schema = 'public')
    THEN 'OK: user_feedback table exists'
    ELSE 'ERROR: user_feedback table does not exist'
  END AS user_feedback_status;

-- Step 4: Check sample data in services table
SELECT category, COUNT(*) as count
FROM services
GROUP BY category
ORDER BY category;

-- Step 5: Check total row counts
SELECT 'services' as table_name, COUNT(*) as row_count FROM services
UNION ALL
SELECT 'user_requests', COUNT(*) FROM user_requests
UNION ALL
SELECT 'user_feedback', COUNT(*) FROM user_feedback
ORDER BY table_name;
