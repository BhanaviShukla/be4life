# ✈️ Travel Feature Documentation

### Wedding Website — Bhanvi & Eshlok

_(b4.life/travel)_

---

## 🧭 Overview

The **Travel** section helps guests plan their journey to Bhopal and Ayodhya for the wedding.  
It includes logistics, packing guidance, flights, weather, and personalized checklists.

### Goals

- Give guests clear travel guidance and reduce planner coordination overhead.
- Ensure information visibility only for invited locations.
- Keep features iterative, each independently deployable.

---

# ✈️ Travel Feature Implementation Plan

_(for b4.life Wedding Website — Bhanvi & Eshlok)_

---

# ✈️ Travel Feature Implementation Plan — UPDATED (Sheets + Session)

---

### 🔐 Pre-Req – RSVP → Google Sheets + Session Context

- [ ] **Service account** for Google Sheets (JSON key in Secrets)
- [ ] `.env`:
  - [ ] `GOOGLE_SHEETS_ID=<sheet_id>`
  - [ ] `GOOGLE_SERVICE_EMAIL=<svc_email>`
  - [ ] `GOOGLE_SERVICE_KEY=<base64_or_json>`
- [ ] Define **Guests sheet** headers (single row per person):  
       `Household_ID, Primary_Contact, First_Name, Last_Name, Phone_E164, Email, Relationship, Invite_Bhopal, Invite_Ayodhya, …`
- [ ] API: `POST /api/rsvp/submit`
  - [ ] Validate input; **write** RSVP fields to Sheets
  - [ ] Upsert by `(Household_ID, First_Name, Last_Name)` or `(Phone_E164)`
  - [ ] Stamp `Updated_At`
- [ ] **Session storage** after RSVP submit:
  - [ ] Save `session.guest = { name, phone_e164 }` (httpOnly cookie)
  - [ ] Consider storing **phone last4** separately for quick verification
- [ ] API: `GET /api/travel/guest` (server)
  - [ ] **read** from Sheets using `session.guest.phone_e164` (or name+phone)
  - [ ] Return minimal, non-sensitive fields needed by travel pages
- [ ] Error handling:
  - [ ] Graceful fallback if session missing (show generic travel info)
  - [ ] Rate-limit APIs, cache reads (60–300s)
- [ ] Security:
  - [ ] Server-only Sheets calls (no client creds)
  - [ ] Input normalization (E.164), escaping, logging redaction

**Commit:** `feat(rsvp): write to Google Sheets and set session context`

---

### 🏗️ Feature 0 – Scaffold & Routing

- [ ] Create `/travel`, `/travel/bhopal`, `/travel/ayodhya`, `/travel/checklist`, `/travel/flights`, `/travel/faq`
- [ ] Add “Travel” to nav
- [ ] Page metadata (title/description/OG)
      **Commit:** `feat(travel): scaffold travel hub and city routes with basic metadata`

---

### 🧱 Feature 1 – Shared UI Components

- [ ] `CityHero`, `InfoBlock`, `CTAButton`, `ContactCard`, `MapEmbed`
- [ ] Dual-theme styles (ivory/mahogany)
- [ ] WCAG AA contrast
      **Commit:** `feat(ui): add shared travel components with dual-theme support`

---

### 🕌 Feature 2 – Bhopal Travel Page (reads Sheets via session)

- [ ] Fetch guest context from `/api/travel/guest`
- [ ] Sections: How to Reach / Where to Stay / Weather & Pack / Highlights / Contacts
- [ ] Hide Ayodhya guidance if guest is **Bhopal-only**
      **Commit:** `feat(travel-bhopal): v1 content; gated by Sheets-driven guest context`

---

### 🌸 Feature 3 – Ayodhya Travel Page (reads Sheets via session)

- [ ] Intercity guidance from Bhopal
- [ ] Hotels, weather, cultural notes, emergency contacts
- [ ] Hide page or show teaser if **not invited**
      **Commit:** `feat(travel-ayodhya): v1 content; gated by Sheets-driven guest context`

---

### 🗺️ Feature 4 – Travel Hub Overview

- [ ] `/travel` hero + city cards
- [ ] Trip timeline (20–26 Nov)
- [ ] CTAs route based on invite (from session/guest API)
      **Commit:** `feat(travel): add overview hub with trip timeline and city cards`

---

### 🧳 Feature 5 – Packing Checklist

- [ ] Categories; localStorage persistence
- [ ] Print/Save as PDF styles (A4)
- [ ] If session present, **filter items** by invited locations
      **Commit:** `feat(travel-checklist): interactive packing list with print styles`

---

### ❓ Feature 6 – Travel FAQ

- [ ] Accessible accordion
- [ ] Answers link to city pages; copy tweaks based on invited locations
      **Commit:** `feat(travel-faq): add expandable FAQ with planner-friendly answers`

---

### ⚙️ Feature 7 – Config-Driven City Data

- [ ] `city.config.ts` types + data
- [ ] Render city pages from config; combine with guest gating
      **Commit:** `refactor(travel): render city pages from typed config source`

---

### ✈️ Feature 8 – Flights Page

- [ ] Curated deeplinks (into BHO; out of LKO on 26 Nov)
- [ ] If **Ayodhya not invited**, show Bhopal-return suggestions instead
      **Commit:** `feat(travel-flights): curated deeplinks; guest-aware routing`

---

### ☀️ Feature 9 – Weather Widget

- [ ] `Weather7Day` mock → live (Open-Meteo)
- [ ] `.env` toggles; caching
      **Commits:**  
      `feat(weather): add 7-day weather widget with mock data`  
      `feat(weather): wire live API with env toggle and caching`

---

### 📋 Feature 10 – RSVP-Aware Checklist

- [ ] Use guest context to include only relevant ceremonies/attire
- [ ] Offline cache snapshot
      **Commit:** `feat(checklist): personalize packing list from RSVP context`

---

### 🧾 Feature 11 – Travel PDF Export

- [ ] Personalized A4 PDF (dates, hotels, contacts, checklist)
      **Commit:** `feat(travel): export personalized travel PDF from hub`

---

### 🛠️ Feature 12 – Config Source (JSON → Sheets)

- [ ] Env toggle `CITY_CONFIG_SOURCE=json|sheets`
- [ ] `/api/travel/config` read-only JSON from Sheets (server)
      **Commit:** `feat(travel-admin): pluggable city config source (json|sheets)`

---

### 🧪 Feature 13 – Analytics & QA

- [ ] Events: flights clicks, print, PDF, contact taps
- [ ] smoke test
      **Commit:** `fix(travel): fixes for bugs found in smoke tests`
