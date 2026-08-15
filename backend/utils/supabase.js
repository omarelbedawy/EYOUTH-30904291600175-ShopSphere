const { createClient } = require('@supabase/supabase-js');

// Server-side client — uses the SERVICE ROLE key (not the anon key),
// since this runs on the backend and needs to write to Storage on
// behalf of admins, bypassing row-level security / bucket policies.
// Never expose SUPABASE_SERVICE_ROLE_KEY to the frontend.
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;