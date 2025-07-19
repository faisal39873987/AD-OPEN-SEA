-- AD PLUS Assistant - Verify Tables
-- Created: July 18, 2025

-- Verify services table
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'services'
ORDER BY 
    ordinal_position;

-- Verify user_requests table
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'user_requests'
ORDER BY 
    ordinal_position;

-- Verify user_feedback table
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'user_feedback'
ORDER BY 
    ordinal_position;

-- Count sample data in services table
SELECT 
    category, 
    COUNT(*) 
FROM 
    services 
GROUP BY 
    category 
ORDER BY 
    category;
