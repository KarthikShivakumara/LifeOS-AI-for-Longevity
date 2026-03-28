import { createClient } from "@supabase/supabase-js";

// ---------------------------
// ENV VARIABLES
// ---------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ---------------------------
// CONFIG CHECK
// ---------------------------
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "your_supabase_url_here";

// ---------------------------
// DEBUG LOG (VERY USEFUL)
// ---------------------------
if (!isConfigured) {
  console.warn("⚠️ Supabase not configured. Running in LOCAL MODE.");
} else {
  console.log("✅ Supabase connected:", supabaseUrl);
}

// ---------------------------
// MOCK CLIENT (SAFE FALLBACK)
// ---------------------------
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => ({
        limit: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),

    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),

    upsert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),

    update: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    }),

    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    }),
  }),

  auth: {
    signInWithPassword: () =>
      Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
};

// ---------------------------
// EXPORT CLIENT
// ---------------------------
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;

// ---------------------------
// EXPORT FLAG
// ---------------------------
export const isSupabaseConnected = isConfigured;