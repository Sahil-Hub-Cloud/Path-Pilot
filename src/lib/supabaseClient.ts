/**
 * Supabase Client — canonical re-export.
 *
 * The project already initialises the client in `supabase.ts`.
 * This module re-exports it under the name requested by the setup guide
 * so that new code can import from either path.
 */
export { supabase } from './supabase';
