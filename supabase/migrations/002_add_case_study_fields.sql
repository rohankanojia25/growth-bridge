-- Migration 002: Add missing fields to case_studies
-- Created: 2026-10-21
-- Adds live_url, services_used, and gallery without dropping or altering existing columns.

ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS live_url TEXT,
  ADD COLUMN IF NOT EXISTS services_used TEXT,
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
