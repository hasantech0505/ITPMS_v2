# IT Park Management System (ITPMS) - Kashkadarya Regional Branch

A full-stack, enterprise-grade management ecosystem for IT Park Kashkadarya with RBAC, startup incubation tracking, resident IT exporter compliance, property marketplace, talent academies, project comment boosters, and AI executive co-pilot.

---

## 🚀 Quick Start (Easiest Local Setup)

The backend is built with **Node.js (Express + TypeScript)** and is designed for **zero-configuration local execution**:
- No local database setup or Docker container is required by default.
- It automatically falls back to an embedded JSON persistence layer (`db_store.json`) pre-populated with realistic ecosystem seed data.
- It runs with full Vite integration for instant frontend and backend development in a single process.

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Add test logins (once) and start the server
```bash
node seed_users.cjs
npm run dev
```
> The unified server will boot on `http://localhost:3000` (serving both the Express API routes at `/api/*` and the React frontend via Vite middleware).

---

## 🏗️ Production Build & Local Production Run

To build and run in optimized production mode locally:

```bash
# 1. Compile the React frontend and bundle the TypeScript backend
npm run build

# 2. Launch the standalone production server
npm start
```

---

## 🔑 Logging In

1. Run `node seed_users.cjs` **once**. It adds these known test accounts to `server/db_store.json`:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `hasan@itpark.uz` | `admin123` |
| **Manager** | `sarvar@itpark.uz` | `manager123` |
| **Agent** | `feruza@itpark.uz` | `agent123` |
| **Resident** | `olim@uzpay.uz` | `resident123` |
| **Viewer** | `jamshid@digital.uz` | `guest123` |

2. On the login page, type the email and password. The "Quick Access Profiles" cards only fill in the email (for the real staff accounts) - passwords are never stored in the frontend, so you always type your own.

> These are **test passwords for local use only**. Change them before putting the system on a shared server.

---

## ⚙️ Environment Variables (Optional)

Copy `.env.example` to `.env` to customize settings:

```bash
cp .env.example .env      # Windows PowerShell: copy .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Server listening port | `3000` |
| `GROQ_API_KEY` | Free key from console.groq.com for the live AI features | *None (offline template fallback)* |
| `DATABASE_URL` | Optional PostgreSQL URI (Neon / Supabase / local) | *None (uses `server/db_store.json`)* |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Token signing secrets | Built-in fallback (change for real use) |
| `GOOGLE_MAPS_PLATFORM_KEY` | Google Maps key for the property map | *None* |
| `UPLOAD_DIR` | Folder for uploaded files | Built-in default |
| `CORS_ORIGIN` | Allowed CORS origins for external API clients | `*` |
| `AUTH_DISABLED` | **Dev only** - skip login (ignored in production) | `false` |

After editing `.env`, fully stop and restart the server.

---

## 📥 Importing Data

Some dashboard figures (IT export / services revenue, office floor space, new jobs) show "No data reported" until the real source data is imported. Older one-off import and fix scripts are kept in `archive/`. Provide the resident financial reports and property/infrastructure files to complete these KPIs.

---

## 🧪 Verification & Code Quality

```bash
# Run TypeScript type check
npm run lint

# Clean build artifacts
npm run clean
```


## Importing the Excel sheets (Residents, Startups, Events, Talents)

The Excel workbooks in the OneDrive `Metadata_` folder feed the website's database. The import is safe to re-run:
it only adds new rows and fills updated fields; notes, meetings, reports and photos added in the website are never deleted.

1. Set `EXCEL_SOURCE_DIR` in `.env` to the `Metadata_` folder (or pass `--dir "<folder>"`).
2. Stop the server, then preview: `npm run import:excel` (dry-run, writes nothing, report in `server/import-report.txt`).
3. If the report looks right: `npm run import:excel:apply` (backs up the database to `server/backups/` first).
4. Residents whose Excel status disagrees with the website (e.g. REMOVED vs Rezident) are only listed; add `--allow-status-changes` to apply them.
