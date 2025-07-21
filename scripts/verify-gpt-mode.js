// Check for gpt_mode_enabled column in auth.users table

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkGptModeColumn() {
  console.log('🔍 Checking for gpt_mode_enabled column in auth.users table...');
  
  try {
    // Use SQL query to check for column existence
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'auth' 
          AND table_name = 'users' 
          AND column_name = 'gpt_mode_enabled'
        );
      `
    });
    
    if (error) {
      console.error('❌ Error checking for gpt_mode_enabled column:', error.message);
      return false;
    }
    
    const columnExists = data[0].exists;
    
    if (columnExists) {
      console.log('✅ gpt_mode_enabled column exists in auth.users table');
      
      // Check if RLS is enabled
      const { data: rlsData, error: rlsError } = await supabase.rpc('exec_sql', {
        query: `
          SELECT relrowsecurity FROM pg_class
          WHERE oid = 'auth.users'::regclass;
        `
      });
      
      if (rlsError) {
        console.error('❌ Error checking RLS status:', rlsError.message);
      } else if (rlsData[0].relrowsecurity) {
        console.log('✅ Row Level Security is enabled on auth.users table');
      } else {
        console.warn('⚠️ Row Level Security is NOT enabled on auth.users table');
      }
      
      return true;
    } else {
      console.error('❌ gpt_mode_enabled column does NOT exist in auth.users table');
      console.log('ℹ️ Run the migration script to add this column:');
      console.log('   ./scripts/migrate-gpt-mode.sh');
      return false;
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the check
checkGptModeColumn()
  .then(result => {
    if (!result) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
