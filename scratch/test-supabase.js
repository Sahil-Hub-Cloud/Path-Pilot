const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Testing Supabase connectivity...');
  console.log('URL:', supabaseUrl);
  try {
    const { data, error } = await supabase.from('colleges').select('*').limit(1);
    if (error) {
      console.log('Error querying colleges table:', error.message);
      if (error.message.includes('does not exist')) {
        console.log('Table "colleges" does not exist. We need to handle/create it.');
      }
    } else {
      console.log('Table "colleges" exists! Row count sample:', data.length);
    }
  } catch (e) {
    console.error('Crash:', e);
  }
}

run();
