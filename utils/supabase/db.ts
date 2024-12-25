import * as relations from "@/supabase/migrations/relations";
import * as sch from "@/supabase/migrations/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const schema = {
  ...sch,
  ...relations,
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, {
  schema,
});
