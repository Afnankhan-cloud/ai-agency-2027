# AI Agency 2027 — Vertex Digitals

Production-ready Next.js 14 App Router storefront and private admin analytics dashboard for **AI Agency 2027 — Everything You Need to Start an AI Agency** by **Vertex Digitals**.

## Features

- **Sales Landing Page (`/`)**: Dark SaaS storefront built with Tailwind CSS, Framer Motion (`prefers-reduced-motion` aware), Geist typography, SEO/Open Graph metadata, `sitemap.xml`, `robots.txt`, JSON-LD `Product`/`Offer` schema, and an original CSS 3D hero bundle mockup.
- **Live Offer Control**: Launch pricing (`₹999` India / `$49` International) automatically switches to regular pricing (`₹1,499` India / `$79` International) after the configured `LAUNCH_BUYER_LIMIT` (default `50` verified paid orders) or optional `LAUNCH_END_AT` timestamp.
- **Privacy-Conscious First-Party Analytics (`/api/events`)**: Tracks session-scoped `page_view` (deduplicated once per session), `cta_click`, and `checkout_start` without storing IP addresses.
- **Verified Webhooks (`/api/webhooks/razorpay`, `/api/webhooks/gumroad`)**: Server-side HMAC/secret verification, idempotent order ingestion keyed on provider order/payment IDs, refund handling, and strict paid-only revenue counting.
- **Protected Admin Dashboard (`/admin`, `/admin/login`)**: Protected via both Next.js middleware and Server Component checks against `ADMIN_EMAIL` using Supabase Auth, featuring Recharts visualizations, funnel progression, India vs. International breakdown, and recent paid orders.

---

## Pre-Launch Content & Legal Placeholders

Before going live, review `lib/constants.ts`:
- **`PLACEHOLDER_TESTIMONIALS`**: Currently contains clearly labeled placeholder slots. Replace those entries with verified customer reviews once orders arrive.
- **`LEGAL_TERMS`**: Contains configurable constants (`refundPolicyAnswer`, `accessDurationAnswer`, `termsSummary`, `privacySummary`) so Vertex Digitals can finalize refund, access-duration, and legal copy prior to launch.

---

## 1. Install and Run Locally

Prerequisites:
- Node.js `20.18+` (or `22+`) and npm `10+`
- A Supabase project
- Razorpay and/or Gumroad accounts for payment links & webhooks

```bash
# 1. Install dependencies
npm install

# 2. Create local environment file from template
cp .env.example .env.local
```

Update `.env.local` with your Supabase and payment settings, then start the development server:

```bash
npm run dev
```

Visit:
- Storefront: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- Admin dashboard: `http://localhost:3000/admin`

Verify type safety, lint, and production build locally:

```bash
npm run typecheck && npm run lint && npm run build
```

---

## 2. Create the Supabase Project

1. Sign in to [Supabase](https://supabase.com/dashboard) and click **New Project**.
2. Choose your organization, enter a project name (e.g., `vertex-ai-agency-2027`), generate a strong database password, and pick the region closest to your primary audience (e.g., Mumbai `ap-south-1` or Singapore `ap-southeast-1`).
3. Wait for the database to finish provisioning.
4. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose in browser code)

---

## 3. Run the SQL Schema

1. Open your Supabase project dashboard and navigate to **SQL Editor**.
2. Open [`supabase/schema.sql`](./supabase/schema.sql) from this repository and copy its full contents.
3. Paste into a new query and click **Run**.

This creates:
- `public.orders` with unique `(provider, provider_order_id)` constraints for idempotent webhook writes
- `public.analytics_events` with a partial unique index ensuring one `page_view` per anonymous session ID
- Strict Row Level Security (`RLS`) revoking direct access from `anon` and `authenticated` browser roles

---

## 4. Create the Admin Account Through Supabase Auth

Admin access is restricted strictly to the user whose verified Supabase Auth email matches `ADMIN_EMAIL` (configured in `.env.local` / Vercel as `ADMIN_EMAIL=afnankhan6381@gmail.com`). No admin password is stored anywhere in source code or `.env.example`.

1. In your Supabase project dashboard, open **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter the exact email set in `ADMIN_EMAIL` (`afnankhan6381@gmail.com`) and choose a strong password.
4. Ensure **Auto Confirm User** is checked so the account can sign in immediately.
5. (Optional) Under **Authentication → Sign In / Providers**, disable public sign-ups if you only want pre-created admin accounts to exist.

Now sign in at `/admin/login` with that email and password.

---

## 5. Configure Razorpay and Gumroad Checkout URLs & Webhooks

### India Market (Razorpay)

1. In the Razorpay Dashboard, create two **Payment Pages** or **Payment Links**:
   - Launch tier (`₹999`) → copy its URL to `RAZORPAY_LAUNCH_CHECKOUT_URL`
   - Regular tier (`₹1,499`) → copy its URL to `RAZORPAY_STANDARD_CHECKOUT_URL`
2. Go to **Account & Settings → Webhooks → Add New Webhook**:
   - **Webhook URL**: `https://your-domain.com/api/webhooks/razorpay`
   - **Secret**: generate a strong random string and set it as `RAZORPAY_WEBHOOK_SECRET`
   - **Active Events**: select `payment.captured`, `order.paid`, `payment_link.paid`, and `refund.processed` / `payment.refunded`
3. `/api/webhooks/razorpay` verifies `x-razorpay-signature` via HMAC-SHA256 over the raw request body and records confirmed paid INR orders idempotently.

### International Market (Gumroad)

1. In Gumroad, create two products (or checkout links) with instant ZIP file delivery:
   - Launch tier (`$49`) → copy URL to `GUMROAD_LAUNCH_CHECKOUT_URL`
   - Regular tier (`$79`) → copy URL to `GUMROAD_STANDARD_CHECKOUT_URL`
2. Generate a strong random secret for `GUMROAD_WEBHOOK_SECRET`.
3. In Gumroad **Settings → Advanced → Ping**:
   - Set **Ping Endpoint** to:
     `https://your-domain.com/api/webhooks/gumroad?secret=YOUR_GUMROAD_WEBHOOK_SECRET`
   - Optionally set `GUMROAD_SELLER_ID` to your Gumroad Seller ID for extra verification.
4. `/api/webhooks/gumroad` verifies the webhook secret (via query param, header, or HMAC signature), ignores test pings unless `ALLOW_TEST_WEBHOOKS=true`, processes refunds/disputes cleanly, and stores verified paid USD orders idempotently by `sale_id`.

### Checkout Routing (`/api/checkout`)

Clicking **Get Instant Access** on either pricing card calls `/api/checkout`, which evaluates the live count of verified `paid` orders in Postgres and `LAUNCH_END_AT`:
- While verified paid orders `< LAUNCH_BUYER_LIMIT` (and before `LAUNCH_END_AT`, if configured), visitors are directed to the launch checkout URL.
- Once the limit or end timestamp is reached, visitors are automatically routed to the standard checkout URL.

---

## 6. Add Vercel Environment Variables

In your Vercel project go to **Settings → Environment Variables** and add:

### Browser-Safe Variables (`NEXT_PUBLIC_*`)
| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your production HTTPS URL (e.g., `https://aiagency2027.vertexdigitals.com`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public support email displayed in the Footer Contact modal |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |

### Server-Only Secrets & Configuration (Never prefix with `NEXT_PUBLIC_`)
| Variable | Purpose |
| --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for verified webhook writes and admin analytics reads |
| `ADMIN_EMAIL` | Authorized administrator email (`afnankhan6381@gmail.com`) |
| `LAUNCH_BUYER_LIMIT` | Maximum founding buyers (`50`) |
| `LAUNCH_END_AT` | Optional ISO-8601 UTC timestamp for a real countdown (leave empty to show only buyer limit) |
| `USD_TO_INR_RATE` | Optional exchange rate used for combined dashboard estimates (`85`) |
| `RAZORPAY_LAUNCH_CHECKOUT_URL` | Razorpay `₹999` checkout URL |
| `RAZORPAY_STANDARD_CHECKOUT_URL` | Razorpay `₹1,499` checkout URL |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook HMAC signing secret |
| `GUMROAD_LAUNCH_CHECKOUT_URL` | Gumroad `$49` checkout URL |
| `GUMROAD_STANDARD_CHECKOUT_URL` | Gumroad `$79` checkout URL |
| `GUMROAD_WEBHOOK_SECRET` | Gumroad webhook verification secret |
| `GUMROAD_SELLER_ID` | Optional Gumroad seller ID check |

---

## 7. Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Open [Vercel](https://vercel.com/new) and import the repository.
3. Framework Preset will auto-detect **Next.js**. Keep the default build command (`next build`).
4. Add all environment variables from Section 6 across **Production** (and **Preview** if desired).
5. Click **Deploy**.
6. After the first deployment finishes:
   - Update `NEXT_PUBLIC_SITE_URL` to your live production domain and redeploy so canonical tags, `sitemap.xml`, and Open Graph metadata point to your production URL.
   - Update your Razorpay Webhook URL and Gumroad Ping URL to use your live production domain.
   - In Supabase **Authentication → URL Configuration**, set **Site URL** to your production domain.
