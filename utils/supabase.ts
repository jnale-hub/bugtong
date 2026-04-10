import type { SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

let supabaseClientPromise: Promise<SupabaseClient> | null = null;

export function getSupabase() {
  if (supabaseClientPromise) {
    return supabaseClientPromise;
  }

  supabaseClientPromise = (async () => {
    await import("react-native-url-polyfill/auto");

    const [{ createClient }, asyncStorageModule] = await Promise.all([
      import("@supabase/supabase-js"),
      Platform.OS === "web"
        ? Promise.resolve(null)
        : import("@react-native-async-storage/async-storage"),
    ]);

    return createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_KEY!,
      {
        auth: {
          storage:
            Platform.OS === "web" ? undefined : asyncStorageModule?.default,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      },
    );
  })();

  return supabaseClientPromise;
}
