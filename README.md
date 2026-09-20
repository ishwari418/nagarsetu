# NagarSetu

**Bridging Citizens, Authorities & Civic Action**

A civic grievance platform where residents report everyday problems — water shortages, road
damage, garbage, drainage, pollution, streetlight failures — and track them through to
resolution, in their own language, from the actual location of the issue.

```
Citizen → Report an Issue → City Admin Review → Status Updates → Resolution
```

---

## Table of contents

- [Problem statement](#problem-statement)
- [Solution](#solution)
- [Key features](#key-features)
- [Technical stack](#technical-stack)
- [Architecture at a glance](#architecture-at-a-glance)
- [File structure](#file-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Demo credentials](#demo-credentials)
- [How each flow works](#how-each-flow-works)
- [What's a placeholder right now](#whats-a-placeholder-right-now)
- [Roadmap / future scope](#roadmap--future-scope)
- [What makes this different](#what-makes-this-different)

---

## Problem statement

Civic issues are part of daily life in Indian towns and cities, but the way they get reported
is broken in a few specific ways:

- **No structured channel.** Complaints travel by phone call and word of mouth, with no record
  either the citizen or the ward office can refer back to.
- **Location tied to the wrong address.** Existing systems assume a complaint is at the
  citizen's home — not at the actual site of the pothole, leak, or garbage pile.
- **English-only interfaces.** The residents most affected by civic neglect are often the
  least served by English-only reporting tools.
- **No visibility after reporting.** Once a complaint is filed, citizens have no way to see
  whether, or when, anything happens next.

## Solution

NagarSetu gives every citizen a direct, trackable channel to their local ward office. A
complaint carries its own real-world location — captured by GPS or picked on a map — moves
through clear status stages, and stays visible to the citizen until it's closed, in a language
they're comfortable using.

```
Citizen registers
      ↓
Logs in → picks a preferred language (once, editable later)
      ↓
Opens "Report an issue"
      ↓
Grants location permission → GPS coordinates → reverse-geocoded to a real address
      ↓ (or, if denied)
Searches or taps a location manually on the map
      ↓
Confirms location → fills category, title, description, photo, days affected
      ↓
Priority is set automatically → complaint saved with lat/lng + full address hierarchy
      ↓
Citizen tracks status on a visual timeline: Submitted → Under review → In progress → Resolved
      ↓
Admin sees the complaint on a map, filters by category/priority/status, updates status with a note
      ↓
Citizen sees the update in real time
```

## Key features

**Citizen side**
- Registration and login with ward-level address details
- Dashboard with live counts (active, resolved, by priority) and recent complaints
- Complaint creation with GPS-based or map-based location, category, photo, and description
- A visual status timeline for every complaint, with who changed what and when
- Profile management, including changeable language preference

**City admin side**
- Separate, non-public admin login (seeded accounts only)
- City-wide dashboard with totals and a category breakdown chart
- Full complaint list with category / priority / status filters
- Per-complaint detail view with map, citizen info, and a status/priority update form
- Ward-level grouping of repeat open complaints (simple counting, not AI clustering)

**Platform-wide**
- Ten Indian languages via local JSON dictionaries, with English fallback — no translation API
- India-wide location support via OpenStreetMap geocoding — no hardcoded city/village list
- Complaint location is independent of the citizen's registered address
- Automatic priority scoring from category + days affected (admin can override)
- No paid APIs, no license fees anywhere in the stack

## Technical stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) + **TypeScript** | Server actions remove the need for a separate REST layer; typed end to end |
| Styling | **Tailwind CSS** | Consistent, responsive design system |
| Data | **Prisma ORM** + **SQLite** | Type-safe queries; zero-config now, swappable for Postgres later without touching app code |
| Auth | HMAC-signed, HTTP-only session cookies | No third-party auth service required |
| Maps | **Leaflet** + **OpenStreetMap** tiles | Interactive maps, no API key, no billing |
| Geocoding | **OpenStreetMap Nominatim** | Reverse geocode GPS → address; forward search for any Indian place; isolated behind one service file so the provider can be swapped later |
| Location capture | Browser **Geolocation API** | Requested only on user action — no continuous tracking, no location history |
| Internationalization | Local JSON dictionaries (`src/locales/`) | Ten languages, English fallback, no LLM or translation API |

Deliberately **not** used: Python, FastAPI, PostgreSQL/PostGIS, Docker, Redis, Kafka,
LangChain, AI agents, SMS/email gateways, paid map APIs.

## Architecture at a glance

```
Browser
  │
  ├─ Server Components (data reads)  ──────────┐
  ├─ Server Actions (writes: auth,             │
  │   complaints, profile, language)           │
  └─ Client Components (forms, map, i18n)      │
                                                ▼
                                          Next.js App Router
                                                │
                        ┌───────────────────────┼───────────────────────┐
                        ▼                       ▼                       ▼
                  Prisma → SQLite      /api/geo/* routes      Session cookie (HMAC)
                  (users, complaints,    → src/lib/geocoding.ts
                   status history)         → Nominatim (reverse geocode + search)
```

## File structure

```
nagarsetu/
├── prisma/
│   ├── schema.prisma              # User, Complaint, ComplaintStatusHistory models
│   └── seed.ts                    # Demo admin, citizens, and sample complaints
│
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Public landing page
│   │   ├── layout.tsx                      # Root layout
│   │   ├── globals.css
│   │   ├── login/page.tsx                  # Citizen login
│   │   ├── register/page.tsx               # Citizen registration
│   │   │
│   │   ├── citizen/
│   │   │   ├── layout.tsx                  # Citizen shell + language provider/modal
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx
│   │   │   │   └── ProfileForm.tsx         # Profile edit + language preference
│   │   │   └── complaints/
│   │   │       ├── page.tsx                # My complaints list
│   │   │       ├── new/
│   │   │       │   ├── page.tsx
│   │   │       │   └── ComplaintForm.tsx   # Category/title/description + location picker
│   │   │       └── [id]/page.tsx           # Complaint detail + timeline + map
│   │   │
│   │   ├── admin/
│   │   │   ├── login/page.tsx              # Separate admin sign-in
│   │   │   └── (console)/
│   │   │       ├── layout.tsx              # Admin shell
│   │   │       ├── dashboard/page.tsx      # City-wide stats + category chart
│   │   │       ├── complaints/
│   │   │       │   ├── page.tsx            # All complaints + filters
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx        # Complaint detail + location + citizen info
│   │   │       │       └── UpdateComplaintForm.tsx
│   │   │       └── incidents/page.tsx      # Repeat reports grouped by ward
│   │   │
│   │   └── api/geo/
│   │       ├── reverse/route.ts            # GPS coordinates → address
│   │       └── search/route.ts             # Free-text place search
│   │
│   ├── components/
│   │   ├── ui.tsx                          # Shared primitives (Card, Field, Button, Badge…)
│   │   ├── Shell.tsx                       # Sidebar layout for citizen/admin
│   │   ├── SubmitButton.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── Captcha.tsx                     # Client-side CAPTCHA placeholder
│   │   ├── StatusTimeline.tsx              # Visual status history
│   │   ├── CategoryChart.tsx               # Admin dashboard bar chart
│   │   ├── LocationSelect.tsx              # Cascading state/district/city (registration)
│   │   ├── ComplaintLocationPicker.tsx     # GPS/manual location capture for complaints
│   │   ├── LanguageProvider.tsx            # React context for translations
│   │   ├── LanguageModal.tsx               # First-login language picker
│   │   └── map/
│   │       ├── MapCanvas.tsx               # Leaflet map (client-only)
│   │       ├── LazyMap.tsx                 # SSR-safe dynamic import
│   │       └── ComplaintMap.tsx            # Read-only map with error boundary
│   │
│   ├── lib/
│   │   ├── db.ts                           # Prisma client singleton
│   │   ├── session.ts                      # Cookie session create/read/verify
│   │   ├── constants.ts                    # Categories, statuses, priorities, badge styles
│   │   ├── location.ts                     # Registration-time state/city data
│   │   ├── geocoding.ts                    # Nominatim wrapper — reverse + search
│   │   ├── i18n.ts                         # Translator, language list, fallback logic
│   │   └── actions/
│   │       ├── auth.ts                     # Register, login (citizen + admin), profile update
│   │       ├── complaints.ts               # Create complaint, update status/priority
│   │       └── language.ts                 # Save language preference
│   │
│   ├── locales/                            # en, hi, mr, bn, te, ta, kn, gu, ml, pa
│   │   └── *.json
│   │
│   └── middleware.ts                       # Route protection for /citizen and /admin
│
├── public/uploads/                          # Complaint photo uploads
├── .env                                     # Local secrets (not committed)
├── .env.example                             # Template for required variables
└── package.json
```

## Getting started

Requires Node.js 18.18+.

```bash
npm install
npx prisma generate
npx prisma db push      # creates prisma/dev.db, adds all tables
npm run db:seed         # loads demo admin, citizens, and sample complaints
npm run dev             # http://localhost:3000
```

`npm run setup` runs all three Prisma steps in one command. Re-run `npm run db:seed` at any
time to wipe and reload demo data.

## Environment variables

```bash
# Session
DATABASE_URL="file:./dev.db"
SESSION_SECRET="change-me-to-a-long-random-string"

# Geocoding (OpenStreetMap Nominatim) — no API key required
GEOCODING_BASE_URL="https://nominatim.openstreetmap.org"
GEOCODING_USER_AGENT="NagarSetu/1.0 (contact: your-real-email@example.com)"
GEOCODING_COUNTRY_CODES="in"
```

Nominatim's usage policy requires a real, identifying User-Agent — put an actual contact
address in `GEOCODING_USER_AGENT` before deploying anywhere public. No keys are exposed to the
browser; all geocoding calls are proxied through `/api/geo/*` server routes.

## Demo credentials

| Role | Sign in at | Email / Mobile | Password |
|---|---|---|---|
| Citizen | `/login` | `ishwari@example.com` | `Citizen@123` |
| Citizen | `/login` | `rohan@example.com` | `Citizen@123` |
| City admin | `/admin/login` | `admin@nagarsetu.gov` | `Admin@123` |

Citizens can also register fresh at `/register`. Admin accounts are seeded only — there is no
public admin registration.

## How each flow works

**Reporting an issue**
1. Citizen presses **Allow location** or **Enter location manually**.
2. On GPS: browser Geolocation API returns coordinates → `/api/geo/reverse` resolves them to a
   state/district/city/locality via Nominatim → shown on a Leaflet map with a draggable pin.
3. On manual: citizen searches a place name (city, town, village, road, landmark) via
   `/api/geo/search`, or taps directly on the map.
4. Citizen confirms the location, fills in category/title/description/photo, and submits.
5. Priority is derived automatically from category + days affected; a complaint number
   (`NGR-<year>-<sequence>`) is generated.

**Tracking a complaint**
- Every status change writes a row to `ComplaintStatusHistory` with who made the change and
  when — rendered as a timeline on both the citizen and admin detail pages.

**Admin review**
- Admin filters the complaint list by category, priority, or status, opens a complaint, and
  updates priority/status with an optional note. The citizen sees the change immediately.

## What's a placeholder right now

Marked visibly in the UI and intentionally not wired up yet:

- CAPTCHA on login pages (client-side character match, not a real challenge)
- "Continue with Google" and "Forgot password?" (show a notice, no real flow)
- Ward-level "Incidents" grouping (plain counting — not AI-based clustering)

Everything else — registration, login, complaint creation with photo upload and live location,
status/priority updates, and the timeline — is fully functional against the database.

## Roadmap / future scope

Deliberately deferred to keep the current build lean and demonstrable:

- AI-assisted incident clustering
- Field agent mobile app and complaint assignment
- Multi-department routing
- Heatmaps and risk analysis by ward
- Citizen-side resolution verification
- SMS / email notifications
- Real CAPTCHA and OAuth (Google) sign-in

## What makes this different

- **Complaint location ≠ home address.** A citizen at home can report a pothole near college —
  the map lets them pin the real site, not just their own.
- **India-wide, without a hardcoded list.** Every state, district, city, town, and village
  works through live geocoding — no manually maintained location database to keep up to date.
- **Swappable geocoding.** Isolated behind a single service file (`src/lib/geocoding.ts`), so
  the provider can change later without touching any UI code.
- **Real multilingual access, not a token switcher.** Ten Indian languages, chosen once at
  first login and changeable anytime from the profile page.
- **Full status audit trail.** Every change is timestamped and attributed — citizens see a real
  history, not a status label that silently updates.
- **Zero-cost, keyless infrastructure.** No Google Maps billing, no SMS/email gateway, no LLM
  calls — a stack a resource-constrained municipal IT team could realistically host.