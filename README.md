# Sreeram × Niyaa · Christmas vacation trip ✈️❤️

A production-ready **mobile-only Next.js web application** designed as a **private digital travel scrapbook** for Sreeram and Niyaa, saving together for their Christmas vacation trip beginning **December 10, 2026**.

---

## ✦ Core Vacation Saving Model

- **Saving Window:** October 1, 2026 → December 10, 2026 (**71 calendar days**, inclusive).
- **Daily Baseline Target:** ₹50 (Sreeram) + ₹50 (Niyaa) = **₹100/day**.
- **Main Trip Fund Target:** **₹7,100** (71 days × ₹100).
- **Bonus Stash Fund:** Any contribution above ₹50 per person per day automatically saves to the **Bonus Stash** for holiday treats, cozy dinners, and spontaneous vacation memories.
- **Progress Separation:** Bonus funds **never** inflate the ₹7,100 baseline target progress percentage.
- **Strict Backward-Only Rule:** Server-side and database-level enforcement rejecting any future contribution date relative to `Asia/Kolkata`.

---

## 🎨 Visual Identity & Aesthetic

- **Design Philosophy:** Apple-level simplicity + travel journal + romantic couple app.
- **Palette:**
  - Deep Obsidian Canvas: `#0A0A0D`
  - Elevated Card Surfaces: `#16171D` & `#1C1D24`
  - Romantic Accent: Dusty Rose (`#E08A9B`)
  - Warm Champagne Accent: `#F3E8D2`
  - Muted Burgundy: `#4A1B24`
  - Warm Off-White Typography: `#F6F4EE`
- **Scrapbook Nuances:** Perforated ticket notches, washi tape accents, passport approval stamp, smooth journey trail, and subtle floating heart particle animations.

---

## 📱 Mobile Architecture

- **Viewport Optimized:** 375px – 428px (iPhone / Android) with safe-area insets (`env(safe-area-inset-top)` & `env(safe-area-inset-bottom)`).
- **Desktop Presentation:** Centered phone layout giving the feel of a native mobile app.
- **PWA:** Installable standalone web app (`manifest.json`, icon assets, theme-color `#0A0A0D`).
- **Interactive iOS Bottom Sheet:** Spring physics for adding/editing savings with live breakdown (Trip Fund vs Bonus Stash).

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Custom Scrapbook Tokens
- **Animations:** Framer Motion (spring curves, journey fill, micro-particles) + Canvas Confetti
- **Backend / Database:** Supabase PostgreSQL with Row Level Security (RLS) & Realtime replication
- **Resilience:** Client-side cache (`localStorage`) + Offline Queue sync

---

## ⚡ Quick Start

### 1. Install & Run Dev Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your phone or in responsive mobile mode in your browser.

### 2. Connect Supabase (Optional for Multi-Device Realtime)
1. Run the SQL script located in [`supabase/schema.sql`](file:///c:/Workspace/tripwebsite/supabase/schema.sql) in your Supabase SQL Editor.
2. Copy `.env.example` to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
*(Note: If Supabase keys are not set, the app seamlessly runs in local offline-first mode out of the box!)*

---

## 🧪 Verified Test Scenarios

Run the business logic and backend API test suites:
```bash
# Test Core Business Logic & 9 Scenarios
npx tsx tests/test-scenarios.ts

# Test API Backend & Backward-Only Rule
npx tsx tests/api-integration.ts
```

All 9 test cases verified:
1. `Oct 1: Sreeram ₹50, Niyaa ₹50` → Main fund +₹100, Bonus +₹0, Day Packed ✓
2. `Oct 2: Sreeram ₹100, Niyaa ₹50` → Main fund +₹100, Bonus +₹50
3. `Oct 3: Sreeram ₹50, Niyaa ₹0` → Main fund +₹50, Bonus +₹0
4. `Oct 4: Sreeram ₹100, Niyaa ₹100` → Main fund +₹100, Bonus +₹100
5. `Attempt to contribute to tomorrow` → Backend rejects with `That day hasn't happened yet ✦`
6. `Attempt to contribute to previous missed date` → Allowed
7. `Main baseline reaches ₹7,100` → Romantic celebration modal with confetti unlocked
8. `Bonus reaches ₹1,000 while main fund is ₹7,100` → Progress remains 100%, bonus displays ₹1,000
9. `One user updates on one phone` → Realtime channel updates second phone automatically
