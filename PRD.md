# 📋 Product Requirements Document (PRD)

## আমার ফসল (Amar Foshol) - HarvestGuard

**Version:** 1.0  
**Last Updated:** November 2025  
**Team:** SteveJobs (Alif, Yasin, Joydeep)  
**Event:** EDU HackFest 2025 - Phase 1 (Pre-Hackathon)

---

## 📌 Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution Summary](#solution-summary)
4. [Target Users](#target-users)
5. [Feature Breakdown](#feature-breakdown)
6. [Technical Specifications](#technical-specifications)
7. [Data Models](#data-models)
8. [API Endpoints](#api-endpoints)
9. [UI/UX Requirements](#uiux-requirements)
10. [Task Assignment](#task-assignment)
11. [Timeline & Milestones](#timeline--milestones)
12. [Acceptance Criteria](#acceptance-criteria)
13. [Submission Checklist](#submission-checklist)

---

## Overview

**আমার ফসল** is a mobile-first web application designed to help Bangladeshi farmers reduce post-harvest food losses through smart weather alerts, crop tracking, and actionable guidance.

**Hackathon Weight:** 50% (Part A - Pre-Hackathon)

**Deliverables:**

- GitHub repository
- Deployed link (Vercel)
- 2-minute video demo

---

## Problem Statement

Bangladesh loses **4.5 million metric tonnes** of food grains annually due to:

- Inadequate storage facilities
- Poor handling practices
- Inefficient transportation

**Economic Impact:** ~$1.5 billion USD annually  
**Food Loss Rate:** 12-32% of staple foods (rice, pulses, vegetables, meat, dairy)

**SDG Alignment:** SDG 12.3 - Reduce food losses along production and supply chains by 2030

---

## Solution Summary

A farmer-friendly app that provides:

1. **Crop Registration** - Track harvested batches
2. **Weather Forecasts** - Hyper-local 5-day forecasts in Bangla
3. **Risk Alerts** - Actionable advisories based on weather + crop data
4. **Gamification** - Badges to encourage good practices

---

## Target Users

### Primary: Bangladeshi Smallholder Farmers

| Attribute    | Details                            |
| ------------ | ---------------------------------- |
| Age          | 25-60 years                        |
| Location     | Rural Bangladesh (all divisions)   |
| Device       | Low-end Android (৪,০০০-৫,০০০ টাকা) |
| Literacy     | Low to moderate                    |
| Language     | Bangla (primary), some English     |
| Internet     | Intermittent connectivity          |
| Tech Comfort | Basic smartphone usage             |

### Key User Needs

- Simple, visual interface
- Large touch targets
- Bangla language support
- Offline functionality
- Fast loading on slow networks

---

## Feature Breakdown

### A1: Landing Page (Alif)

**Purpose:** Introduce the problem and solution, drive registration

| Component       | Requirements                                    |
| --------------- | ----------------------------------------------- |
| Hero Section    | Problem badge, headline, CTA buttons            |
| Problem Stats   | 4.5M tonnes, $1.5B loss, 32% waste              |
| Workflow Visual | Data → Warning → Action → Saved Food (animated) |
| Features Grid   | 4 key features with icons                       |
| Final CTA       | Registration prompt                             |
| Language Toggle | বাংলা ↔ English switch                          |

**Animations Required:**

- Floating grain icons
- Gradient text animation
- Scroll indicator
- Hover effects on cards
- Step-by-step workflow reveal

**Status:** ✅ Complete

---

### A2: Farmer & Crop Management (Joydeep)

**Purpose:** Register farmers and track crop batches

#### A2.1: Farmer Registration

| Field                 | Type     | Validation                           | Required |
| --------------------- | -------- | ------------------------------------ | -------- |
| নাম (Name)            | Text     | Min 2 chars                          | ✅       |
| ইমেইল (Email)         | Email    | Valid email format                   | ✅       |
| পাসওয়ার্ড (Password) | Password | Min 6 chars, hashed (bcrypt/SHA-256) | ✅       |
| ফোন নম্বর (Phone)     | Tel      | 11 digits, starts with 01            | ✅       |
| ভাষা (Language)       | Toggle   | bn / en                              | ✅       |

#### A2.2: Crop Batch Registration

| Field                        | Type     | Options/Validation        | Required |
| ---------------------------- | -------- | ------------------------- | -------- |
| ফসলের ধরন (Crop Type)        | Dropdown | ধান/চাল (Paddy/Rice) only | ✅       |
| আনুমানিক ওজন (Weight)        | Number   | In kg, min 1              | ✅       |
| কাটার তারিখ (Harvest Date)   | Date     | Cannot be future          | ✅       |
| বিভাগ (Division)             | Dropdown | 8 divisions               | ✅       |
| জেলা (District)              | Dropdown | Based on division         | ✅       |
| সংরক্ষণের ধরন (Storage Type) | Dropdown | See below                 | ✅       |

**Storage Types:**

- পাটের বস্তা (Jute Bag Stack)
- সাইলো (Silo)
- খোলা জায়গা (Open Area)
- গুদামঘর (Warehouse)
- ঘরের ভিতর (Indoor)

#### A2.3: Profile Page

| Component         | Details                                 |
| ----------------- | --------------------------------------- |
| User Info         | Name, phone, email, language preference |
| Active Batches    | List of current crop batches            |
| Completed Batches | Historical records                      |
| Loss Events       | Past incidents with dates               |
| Success Rate      | % of successful interventions           |
| Badges            | Achievement badges earned               |

#### A2.4: Achievement Badges

| Badge                            | Trigger                   | Icon |
| -------------------------------- | ------------------------- | ---- |
| প্রথম ফসল (First Harvest)        | Register first batch      | 🌾   |
| সতর্ক কৃষক (Alert Farmer)        | View 5 weather forecasts  | 🌤️   |
| ঝুঁকি প্রতিরোধী (Risk Mitigator) | Complete 3 interventions  | 🛡️   |
| বিশেষজ্ঞ (Expert)                | Save 100kg from loss      | 🏆   |
| নিয়মিত (Regular)                | Log in 7 consecutive days | ⭐   |

#### A2.5: Offline & Export

| Feature         | Implementation          |
| --------------- | ----------------------- |
| Offline Storage | localforage (IndexedDB) |
| Sync            | Auto-sync when online   |
| Export CSV      | All batch data          |
| Export JSON     | Full profile + batches  |

---

### A3: Weather Integration (Yasin)

**Purpose:** Provide hyper-local weather forecasts with actionable Bangla advisories

#### A3.1: Weather API

**Provider:** Open-Meteo (free, no API key)

**Base URL:**

```
https://api.open-meteo.com/v1/forecast
```

**Required Parameters:**

```
latitude={lat}
longitude={lon}
daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,relative_humidity_2m_max
forecast_days=5
timezone=Asia/Dhaka
```

#### A3.2: Location Data

**Divisions & Districts with Coordinates:**

```javascript
const locations = {
  ঢাকা: {
    ঢাকা: { lat: 23.8103, lon: 90.4125 },
    গাজীপুর: { lat: 23.9999, lon: 90.4203 },
    নারায়ণগঞ্জ: { lat: 23.6238, lon: 90.5 },
    // ... add more
  },
  চট্টগ্রাম: {
    চট্টগ্রাম: { lat: 22.3569, lon: 91.7832 },
    কক্সবাজার: { lat: 21.4272, lon: 92.0058 },
    // ... add more
  },
  // ... other divisions
};
```

#### A3.3: Weather Display (Bangla UI)

| Data Point       | Bangla Label        | Format     |
| ---------------- | ------------------- | ---------- |
| Temperature Max  | সর্বোচ্চ তাপমাত্রা  | ৩২°সে      |
| Temperature Min  | সর্বনিম্ন তাপমাত্রা | ২৫°সে      |
| Humidity         | আর্দ্রতা            | ৮৫%        |
| Rain Probability | বৃষ্টির সম্ভাবনা    | ৭০%        |
| Date             | তারিখ               | ১৫ নভেম্বর |

**Number Conversion (English → Bangla):**

```javascript
const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBanglaNum = (num) => String(num).replace(/\d/g, (d) => bnDigits[d]);
```

#### A3.4: Smart Advisories

**Advisory Logic:**

| Condition                   | Bangla Advisory                                            |
| --------------------------- | ---------------------------------------------------------- |
| Rain > 70% for 3+ days      | "আগামী ৩ দিন বৃষ্টি ৮৫% → আজই ধান কাটুন অথবা ঢেকে রাখুন"   |
| Temp > 35°C                 | "তাপমাত্রা ৩৬°C উঠবে → বিকেলের দিকে ঢেকে দিন"              |
| Humidity > 80%              | "আর্দ্রতা বেশি → ফসল শুকানো কঠিন হবে, ঢাকা জায়গায় রাখুন" |
| Rain > 50% + Humidity > 75% | "বৃষ্টি ও আর্দ্রতা বেশি → পাটের বস্তা উঁচু জায়গায় রাখুন" |
| Clear weather               | "আবহাওয়া ভালো → ফসল শুকানোর উপযুক্ত সময়"                 |

**Advisory Card Design:**

```
┌─────────────────────────────────────┐
│ ⚠️ সতর্কতা                          │
│                                     │
│ আগামী ৩ দিন বৃষ্টি ৮৫%              │
│ → আজই ধান কাটুন অথবা ঢেকে রাখুন      │
│                                     │
│ [পদক্ষেপ নিলাম ✓]                   │
└─────────────────────────────────────┘
```

---

### A4: Prediction, Weather Integration, and Risk Forecasting

**Purpose:** Estimate crop spoilage risk using weather trends + simple prediction logic.

#### A4.1: Prediction Engine Logic

- Compute **Estimated Time to Critical Loss (ETCL)**
- Inputs:
  - Continuous high humidity (> 75%)
  - Continuous high temperature (> 33°C)
  - Crop Type (Paddy)
- Baseline ETCL = 120 hours
- Adjustments:
  - Humidity > 80% → −24 hours
  - Temperature > 35°C → −18 hours
  - Rain probability > 70% → −12 hours

**Example Output (Bangla):**  
"উচ্চ আর্দ্রতার কারণে ৭২ ঘন্টার মধ্যে ফসল নষ্ট হওয়ার ঝুঁকি রয়েছে। এখনই ঘরের ভিতরে বাতাস চলাচল নিশ্চিত করুন।"

#### A4.2: 7-Day Mock Weather Integration

- Uses mock data (Temperature, Humidity, Rain Probability)
- Based on registered Division/District
- Refines ETCL predictions

#### A4.3: Risk Summary Output

```
High Risk of Aflatoxin Mold (ETCL: 72 hours)
Weather indicates high humidity → Indoor aeration recommended.
```

---

### A5: Basic Crop Health Scanner (AI Wrapper)

**Purpose:** Let farmers upload pictures to classify crop health.

#### A5.1: Image Upload

- Upload from mobile
- Client-side compression for speed

#### A5.2: Pre-trained Model Integration

- Use HuggingFace API / Teachable Machine
- Output classes:
  - Fresh
  - Rotten

#### A5.3: Output Examples

```
ফসলের অবস্থা: সতেজ 🌾
পরামর্শ: স্বাভাবিকভাবে শুকাতে দিন।
```

```
ফসলের অবস্থা: পচন শুরু ⚠️
পরামর্শ: দ্রুত আলাদা করে রাখুন।
```

#### A5.4: Performance Requirements

- Loads under **3 seconds** on low-end Android
- Model size < 5MB
- Lazy load on first use

---

---

## PART B – Onsite Features (7 hours)

**Weight:** 50%  
**Time Available:** 7 hours onsite  
**AI Assistance:** Allowed but tasks require integration, debugging, and smart decisions

### B1: Local Risk Map (Community Awareness)

**Purpose:** Visualize regional spoilage threats to foster community awareness and contextual decision-making

#### B1.1: Map Integration

| Component     | Specification                                     |
| ------------- | ------------------------------------------------- |
| Library       | Leaflet.js (lightweight, mobile-optimized)        |
| CDN           | `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js` |
| Tile Provider | OpenStreetMap tiles (free)                        |
| Auto-Center   | Based on farmer's registered Division/District    |
| Zoom Level    | 10-12 (district-level view)                       |

#### B1.2: Location Data Structure

```typescript
interface FarmLocation {
  id: string;
  lat: number;
  lon: number;
  cropType: "paddy" | "wheat" | "vegetables";
  riskLevel: "low" | "medium" | "high";
  lastUpdated: Date;
  // No personal identifiers
}

// Mock neighbor data generation
const generateMockNeighbors = (district: string): FarmLocation[] => {
  // Generate 10-15 random points within district boundaries
  // Distribute risk levels: 60% low, 30% medium, 10% high
};
```

#### B1.3: Pin Visualization

| Pin Type    | Color            | Icon | Purpose                         |
| ----------- | ---------------- | ---- | ------------------------------- |
| Own Farm    | Blue (#3b82f6)   | 📍   | Current user's location         |
| Low Risk    | Green (#22c55e)  | 🟢   | Neighboring farms - low risk    |
| Medium Risk | Yellow (#eab308) | 🟡   | Neighboring farms - medium risk |
| High Risk   | Red (#ef4444)    | 🔴   | Neighboring farms - high risk   |

#### B1.4: Bangla Pop-up Template

```javascript
const createBanglaPopup = (location: FarmLocation) => `
  <div class="p-2 min-w-[200px]">
    <p class="font-bold text-base mb-1">
      ফসল: ${getCropNameBn(location.cropType)}
    </p>
    <p class="text-sm mb-1">
      ঝুঁকি: ${getRiskLevelBn(location.riskLevel)}
    </p>
    <p class="text-xs text-gray-600">
      হালনাগাদ: ${formatDateBn(location.lastUpdated)}
    </p>
  </div>
`;

// Translation helpers
const getCropNameBn = (crop: string) =>
  ({
    paddy: "ধান/চাল",
    wheat: "গম",
    vegetables: "সবজি",
  }[crop]);

const getRiskLevelBn = (risk: string) =>
  ({
    low: "নিম্ন (নিরাপদ)",
    medium: "মধ্যম (সতর্ক থাকুন)",
    high: "উচ্চ (জরুরি পদক্ষেপ নিন)",
  }[risk]);
```

#### B1.5: Privacy Constraints

**MANDATORY Privacy Rules:**

- ❌ NO farmer names
- ❌ NO phone numbers
- ❌ NO exact addresses
- ❌ NO farm names
- ✅ Only: Crop type, Risk level, General location (district-level)
- ✅ Anonymized identifiers (e.g., "Farm #23")

#### B1.6: Map Features

| Feature          | Requirement                                |
| ---------------- | ------------------------------------------ |
| Touch Gestures   | Pinch-to-zoom, pan with finger             |
| Performance      | Load < 2 seconds on 3G                     |
| Responsiveness   | Full-width on mobile, sidebar on desktop   |
| Offline Behavior | Show cached map tiles if available         |
| Legend           | Color-coded risk levels with Bangla labels |

#### B1.7: Mock Data Boundaries

**Division-District Coordinate Ranges:**

```javascript
const districtBounds = {
  "ঢাকা-ঢাকা": {
    latMin: 23.7,
    latMax: 23.9,
    lonMin: 90.3,
    lonMax: 90.5,
  },
  "চট্টগ্রাম-চট্টগ্রাম": {
    latMin: 22.2,
    latMax: 22.5,
    lonMin: 91.7,
    lonMax: 92.0,
  },
  // ... add all districts
};
```

---

## Technical Specifications

### Tech Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Framework       | Next.js 16 (App Router) |
| Language        | TypeScript              |
| Styling         | Tailwind CSS v4         |
| Icons           | Phosphor Icons          |
| Offline Storage | localforage             |
| Weather API     | Open-Meteo              |
| Deployment      | Vercel                  |

### Browser Support

| Browser          | Version |
| ---------------- | ------- |
| Chrome Android   | 90+     |
| Samsung Internet | 15+     |
| Firefox Android  | 90+     |
| Safari iOS       | 14+     |

### Performance Targets

| Metric                   | Target            |
| ------------------------ | ----------------- |
| First Contentful Paint   | < 1.5s            |
| Largest Contentful Paint | < 2.5s            |
| Time to Interactive      | < 3.5s            |
| Bundle Size              | < 200KB (initial) |

---

## Data Models

### Farmer

```typescript
interface Farmer {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  language: "bn" | "en";
  createdAt: Date;
  lastLogin: Date;
  badges: Badge[];
}
```

### CropBatch

```typescript
interface CropBatch {
  id: string visually;
  farmerId: string;
  cropType: 'paddy';
  weightKg: number;
  harvestDate: Date;
  division: string;
  district: string;
  storageType: StorageType;
  status: 'active' | 'completed' | 'lost';
  createdAt: Date;
  interventions: Intervention[];
}

type StorageType =
  | 'jute_bag'
  | 'silo'
  | 'open_area'
  | 'warehouse'
  | 'indoor';
```

### WeatherData

```typescript
interface WeatherForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainProbability: number;
}

interface WeatherAdvisory {
  type: "warning" | "info" | "success";
  message: string;
  messageBn: string;
  action: string;
  actionBn: string;
}
```

### Badge

```typescript
interface Badge {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
  earnedAt: Date;
}
```

---

## API Endpoints

### Weather (External)

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=23.8103
  &longitude=90.4125
  &daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,relative_humidity_2m_max
  &forecast_days=5
  &timezone=Asia/Dhaka
```

### Local Storage Keys

| Key              | Data                  |
| ---------------- | --------------------- |
| `farmer_profile` | Farmer object         |
| `crop_batches`   | CropBatch[]           |
| `weather_cache`  | { data, timestamp }   |
| `badges`         | Badge[]               |
| `pending_sync`   | Offline changes queue |

---

## UI/UX Requirements

### Design Principles

1. **Mobile-First** - Design for 360px width first
2. **Bangla-First** - Default language is Bangla
3. **Low-Literacy Friendly** - Use icons + text together
4. **Offline-Ready** - Show cached data when offline
5. **Fast** - Optimize for 3G networks

### Component Specifications

#### Buttons

| Type      | Size                              | Use Case          |
| --------- | --------------------------------- | ----------------- |
| Primary   | 48px height, full-width on mobile | Main CTAs         |
| Secondary | 44px height                       | Secondary actions |
| Icon      | 44x44px min                       | Touch targets     |

#### Typography

| Element | Size (Mobile) | Size (Desktop) |
| ------- | ------------- | -------------- |
| H1      | 32px          | 56px           |
| H2      | 24px          | 40px           |
| H3      | 20px          | 28px           |
| Body    | 16px          | 18px           |
| Small   | 14px          | 14px           |

#### Colors

```css
/* Primary */
--emerald-900: #064e3b; /* Background */
--emerald-500: #10b981; /* Accent */

/* Secondary */
--amber-400: #fbbf24; /* CTA, highlights */
--amber-500: #f59e0b; /* Hover states */

/* Status */
--red-500: #ef4444; /* Warnings */
--green-500: #22c55e; /* Success */
--blue-500: #3b82f6; /* Info */

/* Text */
--white: #ffffff; /* Primary text */
--white/60: rgba(255, 255, 255, 0.6); /* Secondary text */
```

### Page Structure

```
/                    → Landing Page (A1)
/register            → Farmer Registration (A2)
/login               → Login Page (A2)
/dashboard           → Main Dashboard (A2)
/dashboard/profile   → Farmer Profile (A2)
/dashboard/batches   → Crop Batches List (A2)
/dashboard/batches/new → Add New Batch (A2)
/dashboard/weather   → Weather Forecast (A3)
```

---

## Task Assignment

### Alif - A1: Landing Page

| Task                         | Priority | Status      |
| ---------------------------- | -------- | ----------- |
| Hero section with animations | P0       | ✅ Done     |
| Problem statistics section   | P0       | ✅ Done     |
| Workflow visualization       | P0       | ✅ Done     |
| Features grid                | P0       | ✅ Done     |
| Final CTA section            | P0       | ✅ Done     |
| Language toggle (bn/en)      | P0       | ✅ Done     |
| Mobile responsiveness        | P0       | ✅ Done     |
| Footer with team info        | P1       | ✅ Done     |
| 3D model integration (bonus) | P2       | ⏳ Optional |

### Yasin - A2: Farmer & Crop Management

| Task                         | Priority | Status     |
| ---------------------------- | -------- | ---------- |
| Registration form UI         | P0       | ⏳ Pending |
| Password hashing             | P0       | ⏳ Pending |
| Login form UI                | P0       | ⏳ Pending |
| Crop batch registration form | P0       | ⏳ Pending |
| Division/District dropdowns  | P0       | ⏳ Pending |
| Profile page UI              | P0       | ⏳ Pending |
| Batch list view              | P0       | ⏳ Pending |
| localforage integration      | P0       | ⏳ Pending |
| Offline indicator            | P1       | ⏳ Pending |
| CSV export                   | P1       | ⏳ Pending |
| JSON export                  | P1       | ⏳ Pending |
| Badge system                 | P1       | ⏳ Pending |
| Online sync logic            | P2       | ⏳ Pending |

### Joydeep - A3: Weather Integration

| Task                       | Priority | Status     |
| -------------------------- | -------- | ---------- |
| Open-Meteo API integration | P0       | ⏳ Pending |
| Location coordinates data  | P0       | ⏳ Pending |
| 5-day forecast UI (Bangla) | P0       | ⏳ Pending |
| Bangla number conversion   | P0       | ⏳ Pending |
| Temperature display        | P0       | ⏳ Pending |
| Humidity display           | P0       | ⏳ Pending |
| Rain probability display   | P0       | ⏳ Pending |
| Advisory logic             | P0       | ⏳ Pending |
| Advisory cards UI          | P0       | ⏳ Pending |
| Weather caching            | P1       | ⏳ Pending |
| Loading states             | P1       | ⏳ Pending |
| Error handling             | P1       | ⏳ Pending |

### A4: Prediction & Risk Forecasting

| Task                           | Priority | Status     |
| ------------------------------ | -------- | ---------- |
| ETCL calculation logic         | P0       | ⏳ Pending |
| Weather-based risk adjustments | P0       | ⏳ Pending |
| Risk summary UI (Bangla)       | P0       | ⏳ Pending |
| 7-day weather integration      | P1       | ⏳ Pending |
| Aflatoxin mold warnings        | P1       | ⏳ Pending |
| Storage recommendations        | P1       | ⏳ Pending |

### A5: Crop Health Scanner (AI)

| Task                          | Priority | Status     |
| ----------------------------- | -------- | ---------- |
| Image upload UI               | P0       | ⏳ Pending |
| Client-side image compression | P0       | ⏳ Pending |
| HuggingFace/Teachable Machine | P0       | ⏳ Pending |
| Fresh/Rotten classification   | P0       | ⏳ Pending |
| Bangla result display         | P0       | ⏳ Pending |
| Lazy loading optimization     | P1       | ⏳ Pending |
| Model size < 5MB              | P1       | ⏳ Pending |
| 3-second load target          | P1       | ⏳ Pending |

---

## Timeline & Milestones

### Day 1 (Setup)

- [x] Project initialization
- [x] Git repository setup
- [x] Branch creation
- [x] Landing page (A1)
- [ ] Basic routing structure

### Day 2 (Core Features)

- [ ] Registration/Login UI (A2)
- [ ] Weather API integration (A3)
- [ ] Crop batch form (A2)

### Day 3 (Integration)

- [ ] Profile page (A2)
- [ ] Weather advisories (A3)
- [ ] Offline storage (A2)

### Day 4 (Polish)

- [ ] Export functionality (A2)
- [ ] Badge system (A2)
- [ ] Testing on mobile
- [ ] Bug fixes

### Day 5 (Submission)

- [ ] Final testing
- [ ] Deploy to Vercel
- [ ] Record 2-min video demo
- [ ] Submit GitHub + deployed link

---

## Acceptance Criteria

### A1: Landing Page ✅

- [ ] Displays problem statistics accurately
- [ ] Shows workflow animation (Data → Warning → Action → Saved Food)
- [ ] Language toggle works (bn ↔ en)
- [ ] Mobile responsive (works on 360px width)
- [ ] All buttons are 44px+ touch targets
- [ ] Loads in < 3 seconds on 3G

### A2: Farmer & Crop Management

- [ ] Can register new farmer with all required fields
- [ ] Password is hashed (not stored in plain text)
- [ ] Can log in with email/password
- [ ] Can register new crop batch
- [ ] Division/District dropdown works correctly
- [ ] Profile shows all batches
- [ ] Works offline (data saved to localforage)
- [ ] Can export data as CSV
- [ ] Can export data as JSON
- [ ] Badge awarded on first batch registration

### A3: Weather Integration

- [ ] Fetches weather for selected location
- [ ] Shows 5-day forecast
- [ ] All UI text is in Bangla
- [ ] Numbers displayed in Bangla (১২৩)
- [ ] Shows appropriate advisory based on conditions
- [ ] Advisory is understandable by low-literacy users
- [ ] Weather data is cached
- [ ] Shows loading state while fetching
- [ ] Handles API errors gracefully

### A4: Prediction & Risk Forecasting

- [ ] Calculates ETCL (Estimated Time to Critical Loss)
- [ ] Adjusts risk based on humidity > 80%
- [ ] Adjusts risk based on temperature > 35°C
- [ ] Adjusts risk based on rain probability > 70%
- [ ] Displays risk summary in Bangla
- [ ] Shows actionable recommendations
- [ ] Warns about Aflatoxin mold risk
- [ ] Works with 7-day weather data

### A5: Crop Health Scanner

- [ ] Can upload image from mobile camera/gallery
- [ ] Client-side image compression works
- [ ] Classifies crop as Fresh or Rotten
- [ ] Displays result in Bangla with icon
- [ ] Shows appropriate advice based on result
- [ ] Loads under 3 seconds on low-end Android
- [ ] Model size < 5MB
- [ ] Lazy loads on first use

---

## Submission Checklist

### GitHub Repository

- [ ] Clean commit history
- [ ] Meaningful commit messages
- [ ] README.md with setup instructions
- [ ] No sensitive data (API keys, passwords)
- [ ] .gitignore properly configured

### Deployed Link (Vercel)

- [ ] App loads without errors
- [ ] All features work on deployed version
- [ ] Mobile responsive
- [ ] HTTPS enabled

### Video Demo (2 minutes)

- [ ] Shows app purpose/problem
- [ ] Demonstrates A1 landing page
- [ ] Demonstrates A2 farmer registration
- [ ] Demonstrates A2 crop batch registration
- [ ] Demonstrates A3 weather forecast
- [ ] Shows Bangla UI
- [ ] Shows offline functionality
- [ ] Professional quality (clear audio/video)

---

## Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Phosphor Icons](https://phosphoricons.com/)
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [localforage](https://localforage.github.io/localForage/)

### Design

- [Bangla Typography](https://fonts.google.com/specimen/Noto+Sans+Bengali)
- [Color Palette](https://tailwindcss.com/docs/customizing-colors)

### Data

- [Bangladesh Divisions & Districts](https://en.wikipedia.org/wiki/Districts_of_Bangladesh)
- [Bangladesh Coordinates](https://simplemaps.com/data/bd-cities)

---

## Contact

**Team SteveJobs**

| Member  | Role                     | Contact |
| ------- | ------------------------ | ------- |
| Alif    | A1 - Landing Page        | -       |
| Yasin   | A2 - Farmer Management   | -       |
| Joydeep | A3 - Weather Integration | -       |

---

_Last updated: November 2025_
