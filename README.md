# NagarSetu — Phase 1 MVP

Civic grievance platform. Phase 1 covers the citizen flow and the city-admin console, end to end,
on Next.js + Prisma + SQLite.

## Run it

Requires Node.js 18.18+.

```bash
npm install
npm run setup     # prisma generate + db push + seed
npm run dev       # http://localhost:3000
```

`npm run setup` creates `prisma/dev.db` and loads a demo admin, 3 citizens and 7 complaints.
To wipe and reload demo data at any time: `npm run db:seed`.

## Demo credentials

| Role     | Where            | Login                                    |
|----------|------------------|------------------------------------------|
| Citizen  | `/login`         | `ishwari@example.com` / `Citizen@123`    |
| Citizen  | `/login`         | `rohan@example.com` / `Citizen@123`      |
| City admin | `/admin/login` | `admin@nagarsetu.gov` / `Admin@123`      |

Citizens can also register fresh at `/register`. Admins cannot self-register.

## Routes

```
/                          landing
/register  /login          citizen auth
/citizen/dashboard         stats + recent complaints
/citizen/complaints        list (table on desktop, cards on mobile)
/citizen/complaints/new    complaint form + success screen
/citizen/complaints/[id]   details + status timeline
/citizen/profile           view and edit profile
/admin/login               separate admin sign-in
/admin/dashboard           city-wide stats + category chart
/admin/complaints          all complaints, filter by category/priority/status
/admin/complaints/[id]     open a complaint, change priority/status, add a note
/admin/incidents           repeat open reports grouped by ward + category
```

Roles in the schema: `CITIZEN`, `CITY_ADMIN`, `FIELD_AGENT`. Only the first two have screens in Phase 1.

## Marked placeholders

These are visibly labelled in the UI and do nothing real yet:

- CAPTCHA on both login pages (client-side string match, not a real challenge)
- "Continue with Google" and "Forgot password?" (show a notice)
- "Use current location" (fills sample coordinates instead of reading GPS)

Everything else — registration, login, complaint creation with photo upload, status and priority
updates, the timeline — writes to and reads from SQLite.

## Notes

- Sessions are an HMAC-signed HTTP-only cookie. Fine for a demo, not for production.
- Priority is set automatically from category + days affected on submission; admins can override it.
- Complaint numbers are `NGR-<year>-<6 digits>`, generated sequentially.
- Uploaded photos go to `public/uploads/` and are served from there.
- Location data is a local object in `src/lib/location.ts`. No external APIs.

## Not built yet (later phases)

AI clustering, embeddings, risk prediction, PostGIS/geospatial, field-agent dashboard, department
assignment, resolution verification, citizen voting, notifications, SMS/email, real OAuth, real
CAPTCHA, multilingual translation.

---

# Phase 2 — Language + Location

## Language

Ten languages, stored on the user as `preferredLanguage`. Translations are plain JSON in
`src/locales/` with an English fallback for any missing key. No translation API, no LLM.
Complaint text written by citizens is never translated.

- First login shows a language modal (`languageChosen` is false).
- Change it any time at **Profile → Language preference**.
- Server components translate with `translator(lang)`; client components use `useT()`.

Full key coverage: English, Hindi, Marathi. The other seven (Bengali, Telugu, Tamil, Kannada,
Gujarati, Malayalam, Punjabi) cover the core navigation, form, status and location labels; anything
else falls back to English.

## Location

Complaint location is now independent of the citizen's registered address.

- Browser Geolocation API, requested only when the citizen presses a button. No tracking, no
  location history.
- Reverse geocoding and place search go through `/api/geo/reverse` and `/api/geo/search`, which call
  `src/lib/geocoding.ts`. That file is the only place that knows about the provider — swap it for
  MapMyIndia, Photon or a self-hosted Nominatim without touching the UI.
- Map is Leaflet + OpenStreetMap tiles. Marker is draggable and the map is tappable; both re-resolve
  the address. Search accepts any Indian state, district, city, town, village, road or landmark.
- The hardcoded state/city list is gone from the complaint form. It still backs the **registration**
  form, which records the citizen's own address.
- A complaint cannot be submitted until the citizen presses **Confirm location**.

### Environment variables

```
GEOCODING_BASE_URL="https://nominatim.openstreetmap.org"
GEOCODING_USER_AGENT="NagarSetu/1.0 (contact: you@example.com)"
GEOCODING_COUNTRY_CODES="in"
```

No API key is involved and nothing is exposed to the browser. Nominatim's usage policy asks for a
real contact address in the User-Agent and at most one request per second — the service throttles
itself and caches repeat lookups in memory.

### After pulling these changes

```bash
npm install
npx prisma generate
npx prisma db push     # adds the new columns, keeps existing rows
npm run dev
```
