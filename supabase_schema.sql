-- SQL Script to set up the cases table in Supabase

-- Create the 'cases' table
CREATE TABLE IF NOT EXISTS cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  branch TEXT NOT NULL,
  case_no TEXT NOT NULL,
  case_type TEXT NOT NULL CHECK (case_type IN ('CR/ARA', 'NI Act')),
  account_name TEXT NOT NULL,
  filing_date DATE NOT NULL,
  sessions_no TEXT NOT NULL,
  plaintiff TEXT NOT NULL,
  cheque_no TEXT,
  bank TEXT,
  previous_status_date DATE,
  court TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'In Process', 'Disposed', 'Adjourned')),
  hearing_date DATE NOT NULL,
  is_judgement BOOLEAN DEFAULT FALSE,
  pdf_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON cases;
DROP POLICY IF EXISTS "Allow public insert access" ON cases;
DROP POLICY IF EXISTS "Allow public update access" ON cases;

-- Create a policy that allows anyone to read (for this demo/public app)
CREATE POLICY "Allow public read access" ON cases
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert/update (for this demo/public app)
CREATE POLICY "Allow public insert access" ON cases
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON cases
  FOR UPDATE USING (true);
