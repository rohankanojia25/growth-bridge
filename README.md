# Growth Bridge Accelerator — Official Website & Admin System

> High-end marketing website and admin operations system engineered for Growth Bridge Accelerator, Delhi.
> Positioning line: *"Bridging your business to growth."*
> Primary USP: *"One partner for strategy, website, CRM, and marketing."*

---

## 1. Tech Stack Overview

- **Framework**: Next.js 14+ / 16 App Router (React Server Components by default, TypeScript strict)
- **Styling**: Tailwind CSS v4 design tokens via CSS custom properties (`@theme inline` in `globals.css`)
- **Animation & Scroll**: Framer Motion scroll reveals, Lenis smooth scrolling (disabled for reduced motion & touch)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Storage
- **Transactional Email**: Resend with dark-themed table HTML templates
- **Forms & Validation**: React Hook Form + Zod shared client/server schemas
- **Typography**: Space Grotesk (display & headings), Inter (body & UI), JetBrains Mono (eyebrows & labels)
- **Asset Slot System**: `<SiteImage slot="..." />` and `<Logo />` with built-in generative fallbacks

---

## 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical domain (e.g. `https://growthbridgeaccelerator.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `ADMIN_NOTIFICATION_EMAIL` | Destination email for new lead & booking notifications |
| `EMAIL_FROM` | Sender identity (e.g. `Growth Bridge <hello@domain.com>`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (loads after cookie consent) |
| `LEAD_WEBHOOK_URL` | Optional HTTP webhook dispatched on new lead |
| `IP_HASH_SALT` | Secret salt for hashing IP addresses in rate-limiting |

---

## 3. Database Setup (Supabase)

### Step 1: Execute SQL Migration
In your Supabase project dashboard, navigate to the **SQL Editor** and execute the entire contents of:
```
supabase/migrations/001_init.sql
```
This script creates:
- 7 Enum types: `lead_service`, `lead_source`, `lead_status`, `booking_status`, `meeting_mode`, `billing_period`, `package_category`
- 11 Tables: `leads`, `bookings`, `packages`, `case_studies`, `testimonials`, `client_logos`, `blog_posts`, `slug_history`, `site_assets`, `admin_users`, `rate_limits`
- Triggers for `updated_at` and automatic slug history tracking
- Row-Level Security (RLS) policies ensuring anonymous visitors have read-only access to published content, public lead inserts via server service role, and admin full management
- Storage bucket: `assets` with public read access and admin-only upload permissions

### Step 2: Create First Admin User
1. In Supabase Dashboard, go to **Authentication -> Users** and click **Add User -> Create User**.
2. Enter your admin email and a secure password.
3. Open the **SQL Editor** and bind the user to `admin_users`:
```sql
INSERT INTO admin_users (user_id, email)
VALUES ('<PASTE-USER-UUID-FROM-AUTH-USERS>', 'admin@growthbridgeaccelerator.com');
```

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Control Dashboard.

---

## 5. Asset Slot System & Visual Customization

The site features zero hardcoded image paths. Every graphic resolves through the slot system:

1. **Resolution Hierarchy**:
   - Uploaded custom asset in `site_assets` database table
   - Registry default configuration in `src/lib/assets.config.ts`
   - Generative abstract SVG/CSS fallback (mesh, grid, orbit, arch)

2. **Uploading Brand Logos & Photography**:
   - Log into `/admin/login`
   - Navigate to `/admin/assets`
   - Use the **Upload / Replace** buttons for each slot:
     - `logo-full` (transparent SVG/PNG, 200x40 recommended)
     - `logo-mark` (square, 512x512)
     - `hero-visual` (16:10, 1600x1000)
     - `service-consulting`, `service-website`, `service-crm`, `service-marketing` (4:3, 1200x900)
     - `about-hero`, `contact-visual`, etc.
   - Set custom alt tags and focal points (`focal_x`, `focal_y`).
   - Removing an asset immediately restores the generative fallback with zero layout shift.

---

## 6. Manual Redirect Verification Test List (Section 7.2)

To verify all legacy and shortcut redirects reach their destination in a single hop with HTTP 308 (permanent) or 302:

```bash
# Run with curl -I to check HTTP status and Location header

# Static Page Shortcuts (308 Permanent)
curl -I http://localhost:3000/home
# -> Expected 308 to /

curl -I http://localhost:3000/about-us
# -> Expected 308 to /about

curl -I http://localhost:3000/service
# -> Expected 308 to /services

curl -I http://localhost:3000/packages
# -> Expected 308 to /pricing

curl -I http://localhost:3000/contact-us
# -> Expected 308 to /contact

curl -I http://localhost:3000/appointment
# -> Expected 308 to /book-consultation

# Service Aliases (308 Permanent)
curl -I http://localhost:3000/services/consulting
# -> Expected 308 to /services/business-consulting

curl -I http://localhost:3000/services/web-development
# -> Expected 308 to /services/website-generation

curl -I http://localhost:3000/services/crm
# -> Expected 308 to /services/crm-for-businesses

curl -I http://localhost:3000/services/digital-marketing
# -> Expected 308 to /services/full-stack-marketing

# Admin & Shortlinks
curl -I http://localhost:3000/login
# -> Expected 308 to /admin/login

curl -I http://localhost:3000/admin
# -> Expected 308 to /admin/dashboard

curl -I http://localhost:3000/whatsapp
# -> Expected 302 to https://wa.me/918883838363?text=...
```

---

## 7. Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. In Vercel, click **Add New Project** and select this repository.
3. In **Environment Variables**, paste all keys from `.env.example`.
4. Deploy. Vercel automatically detects Next.js App Router and provisions edge caching and ISR endpoints.
