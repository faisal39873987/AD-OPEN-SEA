#!/bin/bash

# Supabase Direct Database Migration Script
# This script connects directly to Supabase's PostgreSQL database and executes our SQL migration

# Supabase database connection details
DB_HOST="db.cceuyhebxxqafmrmnqhq.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="your_db_password_here" # You'll need to replace this with your actual database password

echo "AD PLUS Assistant - Database Migration Script"
echo "--------------------------------------------"
echo "This script will:"
echo "1. Delete old tables (messages, subscription, schema_migrations)"
echo "2. Create new tables (services, user_requests, user_feedback)"
echo ""

# Check if the SQL file exists
SQL_FILE="./database/supabase_migration.sql"
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Error: SQL file not found at $SQL_FILE"
    exit 1
fi

echo "📄 Using SQL file: $SQL_FILE"
echo ""

# Execute the SQL file against Supabase database
echo "🔄 Executing SQL migration..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -f $SQL_FILE

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "The following actions were performed:"
    echo "- Deleted old tables: messages, subscription, schema_migrations"
    echo "- Created new tables: services, user_requests, user_feedback"
    echo "- Added sample data to the services table"
    echo ""
    echo "Your Supabase database now contains only the new tables for AD PLUS Assistant."
else
    echo ""
    echo "❌ Migration failed. Please check the errors above."
fi
