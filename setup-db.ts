import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  const connectionString = "postgresql://postgres:thedevilsadvocate26@db.xhpscrjqxvonabyjejyz.supabase.co:5432/postgres";
  
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log("Connecting to Supabase Postgres...");
    await client.connect();
    console.log("Connected successfully!");

    const sqlPath = path.resolve(process.cwd(), "supabase_schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Executing SQL schema...");
    await client.query(sql);
    console.log("Database schema created successfully!");

    // Seed Data
    console.log("Seeding initial data...");
    const { mockCases } = await import("./data/mockCases");
    
    // Clear existing data to avoid duplicates
    await client.query("DELETE FROM cases");

    for (const c of mockCases) {
      const query = {
        text: `INSERT INTO cases (
          branch, case_no, case_type, account_name, filing_date, 
          sessions_no, plaintiff, cheque_no, bank, previous_status_date, 
          court, status, hearing_date, is_judgement
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        values: [
          c.branch, c.caseNo, c.caseType, c.accountName, c.filingDate,
          c.sessionsNo, c.plaintiff, c.chequeNo || null, c.bank || null,
          c.previousStatusDate || null, c.court, c.status, c.hearingDate, c.isJudgement
        ],
      };
      await client.query(query);
    }
    console.log(`Seeded ${mockCases.length} cases successfully!`);

  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

setupDatabase();
