import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { supabase } from "./lib/supabase";
import { mockCases } from "./data/mockCases";

async function seedData() {
  console.log("Starting data seeding...");

  const formattedCases = mockCases.map((c) => ({
    branch: c.branch,
    case_no: c.caseNo,
    case_type: c.caseType,
    account_name: c.accountName,
    filing_date: c.filingDate,
    sessions_no: c.sessionsNo,
    plaintiff: c.plaintiff,
    cheque_no: c.chequeNo || null,
    bank: c.bank || null,
    previous_status_date: c.previousStatusDate || null,
    court: c.court,
    status: c.status,
    hearing_date: c.hearingDate,
    is_judgement: c.isJudgement,
  }));

  const { data, error } = await supabase.from("cases").insert(formattedCases);

  if (error) {
    console.error("Error seeding data:", error);
  } else {
    console.log("Data seeded successfully!");
  }
}

seedData();
