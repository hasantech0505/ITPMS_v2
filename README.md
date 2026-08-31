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

### 3. Start Local Development Server
```bash
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

## 🔑 Default Login Credentials

The system comes pre-seeded with sample role-based access accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@itpark.uz` | `admin123` |
| **Regional Director** | `director@itpark.uz` | `director123` |
| **Operations Manager** | `manager@itpark.uz` | `manager123` |
| **Resident Founder** | `resident@itpark.uz` | `resident123` |
| **Talent / Mentor** | `talent@itpark.uz` | `talent123` |

---

## ⚙️ Environment Variables (Optional)

Copy `.env.example` to `.env` if you want to customize secrets or connect an external PostgreSQL database:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Server listening port | `3000` |
| `DATABASE_URL` | Optional PostgreSQL URI (e.g., Supabase / Neon / Local PG) | *None (uses embedded local store)* |
| `GEMINI_API_KEY` | Optional API key for live AI executive copilot | *None (has built-in mock fallback)* |
| `JWT_SECRET` | Secret key for JWT access token signing | Built-in fallback |
| `JWT_REFRESH_SECRET` | Secret key for refresh token signing | Built-in fallback |
| `CORS_ORIGIN` | Allowed CORS origins for external API clients | `*` |

---

## 🧪 Verification & Code Quality

```bash
# Run TypeScript type check
npm run lint

# Clean build artifacts
npm run clean
```
