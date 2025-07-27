import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.SUPABASE_DB_URL!,
    process.env.SUPABASE_ANON_KEY!,
);

export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});
