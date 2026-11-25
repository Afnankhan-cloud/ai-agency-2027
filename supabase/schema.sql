-- ============================================================================
-- Vertex Digitals — AI Agency 2027 Database Schema (Supabase / PostgreSQL)
-- Run this entire script inside the Supabase SQL Editor.
-- Safe to re-run: statements are idempotent.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Orders Table (Verified Revenue Only)
-- Populated exclusively by verified Razorpay & Gumroad webhooks via the
-- server-only Supabase service role client.
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('razorpay', 'gumroad')),
  provider_order_id text not null,
  provider_payment_id text,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null,
  market text not null check (market in ('india', 'international')),
  pricing_tier text not null default 'launch' check (pricing_tier in ('launch', 'standard')),
  payment_status text not null check (payment_status in ('paid', 'pending', 'failed', 'refunded')),
  customer_email text,
  raw_event_type text,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint orders_provider_order_unique unique (provider, provider_order_id)
);

create index if not exists idx_orders_status_paid_at
  on public.orders (payment_status, paid_at desc);

create index if not exists idx_orders_market_status
  on public.orders (market, payment_status);

create index if not exists idx_orders_provider_payment_id
  on public.orders (provider, provider_payment_id)
  where provider_payment_id is not null;

-- ----------------------------------------------------------------------------
-- 2. First-Party Privacy-Conscious Analytics Events
-- Stores anonymous session-scoped events without IP addresses or PII.
-- ----------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in ('page_view', 'cta_click', 'checkout_start')),
  session_id text not null check (char_length(session_id) between 8 and 128),
  path text not null default '/',
  market text check (market in ('india', 'international')),
  cta_location text,
  referrer_domain text,
  created_at timestamptz not null default now()
);

-- Enforce at most one page_view per anonymous session ID for clean unique visitor counts.
create unique index if not exists idx_analytics_unique_pageview_per_session
  on public.analytics_events (session_id)
  where event_name = 'page_view';

create index if not exists idx_analytics_event_name_created_at
  on public.analytics_events (event_name, created_at desc);

create index if not exists idx_analytics_session_id
  on public.analytics_events (session_id);

-- ----------------------------------------------------------------------------
-- 3. Row Level Security (Strict Lock-Down)
-- Neither `anon` nor `authenticated` browser roles may read or mutate orders
-- or raw analytics directly. All writes happen in validated Next.js API routes
-- and admin reads happen strictly on the server after ADMIN_EMAIL verification.
-- ----------------------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.analytics_events enable row level security;

revoke all on public.orders from anon, authenticated;
revoke all on public.analytics_events from anon, authenticated;
