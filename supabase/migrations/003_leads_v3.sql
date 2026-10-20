-- Migration 003: Leads Schema Update for Two-Path Conversion (Revision Brief v3)

-- Create enum or check constraint for lead_type
DO $$ BEGIN
  CREATE TYPE lead_type_enum AS ENUM ('idea', 'business');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS lead_type VARCHAR(20) DEFAULT 'idea',
  ADD COLUMN IF NOT EXISTS idea_summary TEXT,
  ADD COLUMN IF NOT EXISTS idea_stage VARCHAR(50),
  ADD COLUMN IF NOT EXISTS starting_budget VARCHAR(50),
  ADD COLUMN IF NOT EXISTS wants_nda BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS challenge VARCHAR(100),
  ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Delhi',
  ADD COLUMN IF NOT EXISTS link_url TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON leads (lead_type);
