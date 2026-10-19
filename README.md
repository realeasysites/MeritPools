# Merit Pools of Portland — Website

Node/Express + SQLite site with a password-protected lead dashboard.
Built on the Real Easy Sites (TBLC) template pattern.

## Quick start
```bash
npm install
cp .env.example .env      # then fill in the values
npm run fetch-images      # one-time: self-host all photos from the old site's CDN
npm start                 # http://localhost:3000
```
Admin dashboard: `/admin` (password only — ADMIN_PASSWORD in `.env`).

## Deploy (Render)
- Build command: `npm install && npm run fetch-images`
- Start command: `npm start`
- Node is pinned to 20.x (`.node-version` + `engines`) — better-sqlite3 needs it.
- Add the `.env` values as Render environment variables.
- Use a Render persistent disk mounted at `/opt/render/project/src/db` so leads survive redeploys.

## Images
Every image is referenced locally (`/images/...`) with an automatic fallback to the old
site's CDN (`irp.cdn-website.com`). Run `npm run fetch-images` so the site keeps working
after the old Duda/Maine Street Marketing site is cancelled.
Liner patterns live in `public/js/data.js` — add/remove a pattern by editing one line.

## Structure
```
server.js          thin entry point
db/database.js     SQLite schema (leads)
lib/auth.js        signed-cookie admin auth
lib/mailer.js      new-lead email notification
routes/quote.js    POST /api/quote (rate-limited, honeypot)
routes/admin.js    dashboard + lead status API
views/             admin login + dashboard pages
public/            the website
scripts/           fetch-images.js
```

## Open items before launch
1. NOTIFY_EMAIL — defaults to PoolsbyMerit@yahoo.com; confirm with client + set up an SMTP sender.
2. Change ADMIN_PASSWORD and SESSION_SECRET.
3. Confirm whether Merit still does new in-ground pool installs (2019 site said yes; current site doesn't) — add a section if so.
4. Confirm the 4.7★ / 25-review figure against their live Google profile.
5. Confirm off-season store hours (Yellow Pages lists a seasonal closure Oct 31 – Apr 20).
6. Real photos: current photos are small/old. A short photo session (store, staff, finished liner jobs) would lift this site more than anything else.
