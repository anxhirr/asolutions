/**
 * Not necessary atm. everything is server side
 */
import { createBrowserClient } from "@supabase/ssr";

export const createAuthClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!,
  );
