# Surety Bond Platform

Fast-build reference app: Next.js (App Router) web app + admin portal, backed by Supabase (Postgres, Auth, Row-Level Security, Storage). Mobile (iOS/Android) will wrap this same Supabase backend via Expo/React Native in a later phase — not built natively from day one.

This is the flagship example for a reusable "fast-build" pattern: Supabase for backend/auth/RLS, Next.js for web + admin, Expo for mobile, deployed to Vercel.

## Roles

- **Customer** — submits bond applications, uploads documents, tracks status
- **Underwriter** — reviews applications, requests documents, approves/rejects
- **Administrator** — manages users, issues bonds, views audit log

Role is stored on `profiles.role` and enforced via Postgres Row-Level Security policies (see `supabase/migrations/0001_init_schema.sql`) — not just in the UI.

## Stack

- Next.js 14 (App Router, TypeScript)
- Supabase (Postgres + Auth + RLS + Storage)
- Tailwind CSS
- Deployed to Vercel

## Local setup

1. `npm install`
2. Copy `.env.example` to `.env.local` (already filled in with the provisioned project's URL + publishable key)
3. `npm run dev`

## Database

Schema and RLS policies live in `supabase/migrations/`. Core tables: `profiles`, `bond_applications`, `documents`, `bonds`, `audit_log`. A trigger auto-creates a `profiles` row (role `customer`) whenever someone signs up.

## Status

Phase 0 scaffold: auth flow, role-based routing skeleton, Supabase clients, initial schema + RLS, minimal dashboards per role. Not yet built: document upload UI, underwriting workflow actions, bond issuance, Stripe payments, audit log UI, native mobile app. See the project plan artifact shared separately for full phased scope and pricing.

## Ownership note

Currently provisioned under the developer's own Supabase/Vercel/GitHub accounts for speed of iteration. Transfer to the client's own accounts (Supabase org, Vercel team, GitHub org, App Store/Play Store listings) is expected before production launch.
