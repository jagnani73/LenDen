import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseService {
    private static db: SupabaseClient;

    public static initSupabase() {
        if (process.env.SUPABASE_URL! && process.env.SUPABASE_API_KEY!) {
            this.db = createClient(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_API_KEY!
            );
            console.info("SupabaseService initiated successfully!");
        } else {
            console.error("Missing env variables.");
            process.exit(1);
        }
    }

    public static getSupabase() {
        if (this.db) {
            return this.db;
        } else {
            this.initSupabase();
            return this.db;
        }
    }
}
