# JanSeva � Bribe Reporting & Civic Transparency Web Application

A production-ready, civic-transparency web application built with **Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, and MongoDB/Mongoose**.

The platform provides a neutral, trustworthy avenue for citizens to anonymously document and report unauthorized bribe demands, harassment, and unfulfilled public duties across civic sectors.

---

## ??? Core Features

- **? Under 60-Second Fast Reporting Flow**:
  - **Camera Capture**: In-app camera viewfinder (`navigator.mediaDevices.getUserMedia`) with mobile fallback (`capture="environment"`) and device photo selection.
  - **Privacy First / EXIF Stripping**: Image metadata (GPS, camera serial numbers, device timestamps) is stripped server-side via `sharp` before storage.
  - **Geolocation Auto-Detection**: Free-tier OpenStreetMap Nominatim reverse geocoding matches GPS coordinates to Indian States, Districts, and Localities.
  - **Complete Indian States & Districts Hierarchy**: Pre-packaged dataset covering all 28 states and 8 union territories for offline reliability.
  - **1-Tap Sector Categorization**: Roads, Education, Hospitals, Police, Municipal Services, Government Offices, Land/Property, Licenses, etc.
  - **Anonymity Guarantee**: No user account or phone number required. Validation prevents accidental leakage of phone numbers, emails, or Aadhaar numbers.

- **?? Public Incident Feed & Advanced Search**:
  - Search by keyword, description, area, district, state, or category.
  - Cascading State & District filters.
  - Real-time live statistics counters (Reports Submitted, Published, States & Districts Covered).
  - Responsive cards with category badges, timestamps, report IDs (e.g. `BRB-8F42K`), and location breadcrumbs.

- **??? Civic Moderation & Safety Dashboard (`/admin`)**:
  - Two-tier publication workflow: `pending` ? `reviewed` ? `published` (or `rejected`/`removed`).
  - Moderator passcode authentication.
  - Moderation queue with photo review, approval actions, and custom rejection notes.
  - Prevents public harassment, personal phone number leaks, or defamatory content.

---


---

## ?? Quick Start

### 1. Installation
```bash
npm install
```

### 2. Seed Sample Reports
Populates realistic initial civic reports across Punjab, Maharashtra, Karnataka, Delhi, Rajasthan, UP, Gujarat, and Tamil Nadu:
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ?? Environment Variables (`.env.local`)

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```



---

## ?? Civic Neutrality Notice

JanSeva is an open civic-transparency platform. It documents crowd-sourced citizen accounts and does not make judicial findings. We encourage citizens to also register official complaints with state anti-corruption bureaus (ACB) and the Central Vigilance Commission (CVC).
