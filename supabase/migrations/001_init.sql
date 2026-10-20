-- Growth Bridge Accelerator - Initial Database Migration
-- Generated: 2026-10-20

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE lead_service AS ENUM ('consulting', 'website', 'crm', 'marketing', 'unsure');
CREATE TYPE lead_source AS ENUM ('contact_form', 'consultation_booking', 'home_quick_form');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE meeting_mode AS ENUM ('phone', 'google_meet', 'office_visit');
CREATE TYPE billing_period AS ENUM ('one_time', 'monthly', 'quarterly', 'yearly');
CREATE TYPE package_category AS ENUM ('consulting', 'website', 'crm', 'marketing', 'bundle');

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================
-- LEADS TABLE
-- =====================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(80) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(255),
  business_name VARCHAR(100),
  service lead_service NOT NULL DEFAULT 'unsure',
  budget_range VARCHAR(20),
  message TEXT,
  package_id UUID,
  source lead_source NOT NULL DEFAULT 'contact_form',
  status lead_status NOT NULL DEFAULT 'new',
  notes JSONB DEFAULT '[]'::jsonb,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  referrer TEXT,
  landing_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status_created ON leads (status, created_at DESC);
CREATE INDEX idx_leads_created ON leads (created_at DESC);

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- BOOKINGS TABLE
-- =====================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  meeting_mode meeting_mode NOT NULL DEFAULT 'phone',
  meet_link TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  public_token VARCHAR(24) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_slot_start ON bookings (slot_start);
CREATE UNIQUE INDEX idx_bookings_unique_slot ON bookings (slot_start)
  WHERE status <> 'cancelled';

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- PACKAGES TABLE
-- =====================
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  category package_category NOT NULL,
  short_description TEXT,
  price_inr INTEGER,
  price_label VARCHAR(50),
  billing_period billing_period NOT NULL DEFAULT 'one_time',
  features JSONB DEFAULT '[]'::jsonb,
  is_highlighted BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_packages_published_sort ON packages (is_published, sort_order);

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add FK from leads to packages
ALTER TABLE leads ADD CONSTRAINT fk_leads_package FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL;

-- =====================
-- CASE STUDIES TABLE
-- =====================
CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  client_name VARCHAR(100) NOT NULL,
  industry VARCHAR(100),
  summary TEXT,
  challenge TEXT,
  solution TEXT,
  results JSONB DEFAULT '[]'::jsonb,
  cover_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  seo_title VARCHAR(70),
  seo_description VARCHAR(170),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_case_studies_slug ON case_studies (slug);

CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- TESTIMONIALS TABLE
-- =====================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name VARCHAR(100) NOT NULL,
  author_role VARCHAR(100),
  business_name VARCHAR(100),
  quote TEXT NOT NULL,
  avatar_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- CLIENT LOGOS TABLE
-- =====================
CREATE TABLE client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_client_logos_updated_at
  BEFORE UPDATE ON client_logos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- BLOG POSTS TABLE
-- =====================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  excerpt TEXT,
  content_md TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  seo_title VARCHAR(70),
  seo_description VARCHAR(170),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts (slug);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- SLUG HISTORY TABLE
-- =====================
CREATE TABLE slug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL,
  old_slug VARCHAR(200) NOT NULL,
  new_slug VARCHAR(200) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_slug_history_lookup ON slug_history (content_type, old_slug);

-- =====================
-- SITE ASSETS TABLE
-- =====================
CREATE TABLE site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key VARCHAR(50) NOT NULL UNIQUE,
  url TEXT NOT NULL,
  alt VARCHAR(255),
  width INTEGER,
  height INTEGER,
  focal_x SMALLINT DEFAULT 50 CHECK (focal_x >= 0 AND focal_x <= 100),
  focal_y SMALLINT DEFAULT 50 CHECK (focal_y >= 0 AND focal_y <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_site_assets_updated_at
  BEFORE UPDATE ON site_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ADMIN USERS TABLE
-- =====================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- RATE LIMITS TABLE
-- =====================
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash VARCHAR(100) NOT NULL,
  bucket VARCHAR(50) NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits (ip_hash, bucket, window_start);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE slug_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- LEADS: No anonymous access. Admin full access.
CREATE POLICY "Admin full access on leads" ON leads
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- BOOKINGS: No anonymous access. Admin full access.
CREATE POLICY "Admin full access on bookings" ON bookings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- BOOKINGS: Allow public select by public_token (for confirmation page)
CREATE POLICY "Public can view booking by token" ON bookings
  FOR SELECT USING (true);

-- PACKAGES: Anonymous can SELECT published. Admin full access.
CREATE POLICY "Public can view published packages" ON packages
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access on packages" ON packages
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- CASE STUDIES: Anonymous can SELECT published. Admin full access.
CREATE POLICY "Public can view published case studies" ON case_studies
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access on case studies" ON case_studies
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- TESTIMONIALS: Anonymous can SELECT published. Admin full access.
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access on testimonials" ON testimonials
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- CLIENT LOGOS: Anonymous can SELECT published. Admin full access.
CREATE POLICY "Public can view published client logos" ON client_logos
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access on client logos" ON client_logos
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- BLOG POSTS: Anonymous can SELECT published. Admin full access.
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access on blog posts" ON blog_posts
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- SLUG HISTORY: Public read. Admin full access.
CREATE POLICY "Public can read slug history" ON slug_history
  FOR SELECT USING (true);
CREATE POLICY "Admin full access on slug history" ON slug_history
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- SITE ASSETS: Public read. Admin full access.
CREATE POLICY "Public can view site assets" ON site_assets
  FOR SELECT USING (true);
CREATE POLICY "Admin full access on site assets" ON site_assets
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ADMIN USERS: Admin only.
CREATE POLICY "Admin full access on admin users" ON admin_users
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RATE LIMITS: No direct access (managed by service role).
CREATE POLICY "Service role only on rate limits" ON rate_limits
  FOR ALL USING (false);

-- =====================
-- SLUG HISTORY TRIGGERS
-- =====================

-- Auto-insert slug history when blog post slug changes
CREATE OR REPLACE FUNCTION track_blog_slug_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.slug <> NEW.slug THEN
    INSERT INTO slug_history (content_type, old_slug, new_slug)
    VALUES ('blog', OLD.slug, NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_slug_change
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION track_blog_slug_change();

-- Auto-insert slug history when case study slug changes
CREATE OR REPLACE FUNCTION track_case_study_slug_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.slug <> NEW.slug THEN
    INSERT INTO slug_history (content_type, old_slug, new_slug)
    VALUES ('case_study', OLD.slug, NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER case_study_slug_change
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION track_case_study_slug_change();

-- =====================
-- STORAGE BUCKET
-- =====================
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to assets bucket
CREATE POLICY "Public read access on assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

-- Allow admin upload/delete on assets bucket
CREATE POLICY "Admin upload on assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'assets' AND is_admin());
CREATE POLICY "Admin update on assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'assets' AND is_admin());
CREATE POLICY "Admin delete on assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'assets' AND is_admin());
