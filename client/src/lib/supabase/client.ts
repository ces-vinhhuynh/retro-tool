import { createBrowserClient } from '@supabase/ssr';

import { env } from '@/config/env';
import { Database } from '@/types/database';

function createClient() {
  return createBrowserClient<Database>(
    env.SUPABASE_URL ?? '',
    env.SUPABASE_ANON_KEY ?? '',
  );
}

export default createClient();
