-- Migration 002: Case Studies Enhancement (Revision Brief v3)
ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS live_url TEXT,
  ADD COLUMN IF NOT EXISTS services_used TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
