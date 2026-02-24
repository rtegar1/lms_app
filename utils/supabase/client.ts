import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Membuat client untuk penggunaan di browser/client-side
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}