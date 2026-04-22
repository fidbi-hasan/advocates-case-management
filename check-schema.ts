import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { supabase } from "./lib/supabase";

async function checkSchema() {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Schema Check Error:", error);
  } else {
    console.log("Column names in 'cases' table:", data.length > 0 ? Object.keys(data[0]) : "No data to check");
  }
}

checkSchema();
