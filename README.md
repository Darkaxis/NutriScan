# NutriScan — Food Search & Nutrition App

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v18+` (`node -v`)
- **npm**: `v9+` (`npm -v`)
- **MySQL Server**: `8.0+` running on port `3306` (e.g. Laragon, Docker, or standalone MySQL)

---

### 2. Installation
Clone the repository and install all dependencies:
```bash
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Install frontend dependencies
cd frontend && npm install && cd ..
```

---

### 3. Environment Configuration

#### Backend (`backend/.env`):
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://root:@localhost:3306/food_system"
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="food_system_jwt_super_secret_dev_key_2026_production_grade"
STRIPE_SECRET_KEY="sk_test_placeholder_key_replace_with_yours"
STRIPE_WEBHOOK_SECRET="whsec_placeholder_webhook_secret_for_local_cli"
DEMO_USER_EMAIL="demo@foodsystem.test"
```

#### Frontend (`frontend/.env.local`):
Create `frontend/.env.local` (or copy from `frontend/.env.example`):
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

### 4. Database Setup & Seeding
Ensure your MySQL server is running on port 3306, then execute:
```bash
cd backend
npx prisma db push
npm run db:seed
```
*Creates the demo user (`demo@foodsystem.test` / password: `Password123!`) and baseline search history.*

---

### 5. Running the Application

#### Option A: Single Command (Root)
```bash
npm run dev
```
Launches both backend (`http://localhost:5000`) and frontend (`http://localhost:3000`) concurrently.

#### Option B: Separate Terminals
```bash
# Terminal 1 — Backend API
cd backend && npm run dev

# Terminal 2 — Frontend App
cd frontend && npm run dev
```

---

## Automated Tests

### Backend Tests (24 passing)
Runs tests covering authentication, search normalization, rate limiting, and subscription access gates:
```bash
cd backend
npm test
```

### Frontend Typecheck & Build
```bash
cd frontend
npm run build
```

---

## Access Tiers & Paywall

| Tier | Search Results | Macronutrients & Nutrition Facts | Search History |
| :--- | :--- | :--- | :--- |
| **Guest (Not Logged In)** | First 2 products visible; remaining items blurred with sign-in prompt | Locked | Disabled |
| **Free Member** | All search results unblurred | Locked (Upgrade to Pro prompt) | Saved to MySQL |
| **Pro Subscriber** ($9.99/mo) | All search results unblurred | Full nutrition data unlocked (calories, fats, carbs, sugars, protein, salt) | Saved to MySQL |

---

## Technical Decisions

1. **Separating Express and Next.js**:
   Instead of putting all API logic inside Next.js route handlers, the backend is kept as an independent Express service. This keeps things modular and easier to test with Supertest without booting the Next.js frontend. It also simplifies handling raw-body Stripe webhook signatures and keeps database connection pooling with Prisma predictable.

2. **Backend Proxy for Open Food Facts**:
   All product searches go through our backend rather than calling Open Food Facts directly from the browser:
   - **Data Cleaning**: The Open Food Facts API is community-driven and can be inconsistent. The backend strips taxonomy prefixes (like `en:beverages`), cleans up labels, and provides sensible defaults for missing fields.
   - **Server-Side Paywall**: Full macronutrient data is stripped on the server for guests and free users, so locked data is never exposed in browser network responses.
   - **Offline Fallback**: A local fallback dataset is included so search continues to function even if the public Open Food Facts API is slow or temporarily unavailable.

3. **Prisma ORM with MySQL**:
   Prisma was chosen for type-safe database queries and simple schema syncing (`prisma db push`). It handles user accounts, search history records, and Stripe subscription tracking with minimal boilerplate.

4. **Simple Email/Password Auth with JWT**:
   To make local evaluation easy and avoid third-party OAuth setup, we used standard email/password authentication. Passwords are salted and hashed using Node's built-in `crypto.scrypt`, and sessions use JWTs stored in HTTP-only cookies (with Authorization header fallback for API testing).

5. **Stripe Checkout for Subscriptions**:
   Instead of collecting payment cards directly, the app delegates to Stripe Checkout. For local development where webhooks might not be running through the Stripe CLI, we added an automatic session verification step upon redirect, and provide full self-serve subscription cancellation directly through Stripe.

---

## Internationalization (i18n)

The app supports 4 languages: **English (EN)**, **Dutch (NL)**, **German (DE)**, and **French (FR)**.

- **UI Translations**: Client-side text is loaded from JSON dictionaries (`frontend/src/i18n/{lang}.json`) using a lightweight React context.
- **Product Data Fallback & Language Availability**: When fetching products, the backend checks for language-specific fields first. If not available in the user's language, it smoothly falls back to any available language (e.g., English, French, German, or Dutch). A badge indicates which language is being displayed (e.g. `FR`, `DE`, `EN`), and the detail modal notifies the user if the packaging text is only recorded in specific languages (e.g., `FR · EN`).
- **Instant Switch**: Changing the language in the navbar immediately updates the UI and re-runs the current search with the selected language code.

---

## Security Considerations

- **SQL Injection**: All database queries use Prisma's parameterized queries.
- **Rate Limiting**: Express middleware limits authentication attempts (15 requests per 15 minutes) and search requests (60 per minute) to guard against brute-force attempts and scraping.
- **Security Headers**: Standard security headers are configured using `helmet` (nosniff, clickjacking protection, disabled X-Powered-By).
- **Input Sanitization**: Barcodes are checked against digit patterns (8–14 digits) and search queries are trimmed and length-limited.
- **Server-Side Paywall Enforcement**: The nutrition table endpoint (`/api/products/:barcode/nutrition`) validates active Pro subscription status on the server before returning macronutrient data.

---

## Known Limitations

1. **Open Food Facts Data Completeness**: Because Open Food Facts relies on crowd-sourced contributions, some products lack complete ingredient lists or macronutrient breakdowns. When fields are missing, the UI displays clear fallback indicators rather than breaking.
2. **Multilingual Product Coverage**: While the interface is fully translated into 4 languages (**English**, **Dutch**, **German**, and **French**), actual product descriptions and ingredients from Open Food Facts depend on what was uploaded in each country. For example, an item scanned in France may only have ingredient text in French. When a specific translation is missing, the app gracefully falls back to the original label or English.
3. **Caching & Upstream Rate Limits**: The public Open Food Facts API can occasionally be slow or rate-limited under heavy traffic. In production, adding a Redis cache (e.g. 1 hour for search queries, 24 hours for barcode lookups) would reduce external calls and improve response times.
4. **In-Memory Rate Limiting**: The rate limiter currently tracks requests in server memory. For a horizontally scaled production deployment across multiple servers, this would be backed by Redis.
5. **Local Stripe Webhooks**: Receiving Stripe webhooks on `localhost` normally requires the Stripe CLI. For convenient local testing, the app verifies the checkout session directly via `/api/stripe/verify-session` upon return, and supports instant subscription cancellation via `/api/stripe/cancel-subscription`.

---

## REST API Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (`username`, `email`, `password`) | Public |
| `POST` | `/api/auth/login` | Log in with email or username | Public |
| `GET` | `/api/auth/me` | Current user profile and subscription status | Authenticated |
| `POST` | `/api/auth/logout` | Log out and clear session cookie | Authenticated |
| `GET` | `/api/products/search?q={query}&lang={lang}` | Search food products | Public (Guest rules apply) |
| `GET` | `/api/products/:barcode?lang={lang}` | Get product details by barcode | Public |
| `GET` | `/api/products/:barcode/nutrition` | Get detailed macronutrient table | Pro Subscribers |
| `GET` | `/api/searches/recent` | Get user's recent search history | Authenticated |
| `DELETE`| `/api/searches` | Clear user's search history | Authenticated |
| `POST` | `/api/stripe/create-checkout-session` | Start Stripe checkout session | Authenticated |
| `POST` | `/api/stripe/verify-session` | Verify completed checkout and activate Pro | Authenticated |
| `POST` | `/api/stripe/cancel-subscription` | Cancel active Pro subscription | Authenticated Pro Users |
