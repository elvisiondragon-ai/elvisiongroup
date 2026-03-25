const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL() {
  try {
    const sql = fs.readFileSync('assist_code/fix_remaining_rls_issues.sql', 'utf8');
    
    // Split by semicolon to execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement.trim() });
        
        if (error) {
          console.error('Error:', error.message);
        } else {
          console.log('Success');
        }
      }
    }
  } catch (error) {
    console.error('Failed:', error.message);
  }
}

executeSQL();