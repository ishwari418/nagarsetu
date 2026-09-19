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
