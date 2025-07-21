-- Check service_providers table
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'service_providers'
ORDER BY 
    ordinal_position;

-- Check chat_requests table
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'chat_requests'
ORDER BY 
    ordinal_position;

-- Check indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public' AND
    (tablename = 'service_providers' OR tablename = 'chat_requests');
