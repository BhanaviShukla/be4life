# ✈️ Flights Page Feature Documentation

### Wedding Website — Bhanvi & Eshlok

_(be4.life/travel/flights)_

---

## 🎯 Objective

Enable guests to plan their wedding travel by entering their **origin city or airport**, then generate a **personalized 2–3 leg flight itinerary** (based on RSVP data) with **recommended arrival/departure windows** and **deeplinks** to Google Flights / Skyscanner.

---

## 🗂️ Overview of Guest Journeys

| RSVP Scope           | Legs Generated                     | Notes             |
| -------------------- | ---------------------------------- | ----------------- |
| **Bhopal only**      | Origin → Bhopal → Origin           | No Ayodhya legs   |
| **Ayodhya only**     | Origin → Ayodhya → Origin          | Ayodhya = AYJ/LKO |
| **Bhopal + Ayodhya** | Origin → Bhopal → Ayodhya → Origin | Full trip plan    |

---

## 📋 Feature Breakdown & Tasks

### 🧩 1. Origin Input & Autosuggest

**Purpose:** Capture where guests are flying from.

**TODO**

- [ ] Add input: “Where are you flying from?”
- [ ] Support city names & IATA codes (e.g., Dubai / DXB).
- [ ] Autocomplete common origins: DXB, DEL, BLR, BOM, LHR, SIN.
- [ ] Normalize to IATA code for backend/deeplinks.
- [ ] Save selection in local state.

**Commit:**  
`feat(travel-flights): add origin input with autosuggest and normalization`

---

### 🧭 2. Flight Legs Generator

**Purpose:** Build 2–3 flight segments dynamically.

**TODO**

- [ ] Read RSVP scope via `/api/travel/guest` (from Google Sheets).
- [ ] Generate legs based on scope:
  - [ ] BOTH → Origin→BHO, BHO→AYJ/LKO, AYJ/LKO→Origin
  - [ ] BHOPAL_ONLY → Origin→BHO, BHO→Origin
  - [ ] AYODHYA_ONLY → Origin→AYJ/LKO, AYJ/LKO→Origin
- [ ] Store in local state as `LegPlan[]`.
- [ ] Allow users to override leg dates.

**Commit:**  
`feat(travel-flights): generate legs dynamically from RSVP scope`

---

### 🕓 3. Recommended Arrival & Departure Windows

**Purpose:** Guide guests to arrive/depart at the right times.

**Defaults:**
| Leg | Best | Latest Safe | Notes |
|-----|------|--------------|-------|
| Origin→Bhopal | Arrive by **Nov 20, 8PM** | Latest **Nov 21, 10AM** | Tilak + prep events |
| Bhopal→Ayodhya | Arrive by **Nov 24, 6PM** | Latest **Nov 25, 12PM** | Mehendi + wedding |
| Ayodhya→Origin | Depart after **Nov 26, 2PM** | — | Post-Vidai buffer |

**TODO**

- [ ] Render date pickers with these defaults.
- [ ] Show “Best arrival” & “Latest safe arrival” badges per leg.
- [ ] Update deeplinks on date change.
- [ ] Tooltip explaining each recommendation.

**Commit:**  
`feat(travel-flights): add date windows and arrival/departure guidance`

---

### 🔗 4. Deeplink Builders (Google Flights & Skyscanner)

**Purpose:** Redirect users to pre-filled flight search results.

**TODO**

- [ ] Utility: `buildGoogleFlightsLink({from,to,date})`
  - `https://www.google.com/travel/flights?q=Flights%20from%20${FROM}%20to%20${TO}%20on%20${YYYY-MM-DD}`
- [ ] Utility: `buildSkyscannerLink({from,to,date})`
  - `https://www.skyscanner.com/transport/flights/${FROM}/${TO}/${YYMMDD}/?adults=1`
- [ ] Prefer AYJ (Ayodhya) → fallback to LKO (Lucknow).
- [ ] Add “Search on Google Flights” & “Search on Skyscanner” buttons per leg.
- [ ] Open links in new tabs.

**Commit:**  
`feat(travel-flights): add deeplink builders and external search buttons`

---

### 🧭 5. Estimated Schedule Summary

**Purpose:** Display the full plan visually.

**TODO**

- [ ] Add visual itinerary (vertical or horizontal timeline).
- [ ] Show legs, dates, badges (“Best / Safe”), and flight search buttons.
- [ ] Include textual summary under it:
  - “Arrive in Bhopal by Nov 20 night.”
  - “Depart Ayodhya after Nov 26 afternoon.”
- [ ] Responsive design (timeline collapses on mobile).

**Commit:**  
`feat(travel-flights): add itinerary timeline summary and responsive layout`

---

### 📅 6. Date Override & Real-Time Deeplink Updates

**Purpose:** Allow manual adjustment of travel dates.

**TODO**

- [ ] Add inline date pickers beside each leg.
- [ ] Update deeplink URL dynamically on change.
- [ ] Add “Reset to Recommended” option.
- [ ] Validate input dates (don’t allow arrival after key events).
- [ ] Show error message for invalid sequences.

**Commit:**  
`feat(travel-flights): add editable date pickers with live deeplink updates`

---

### 🧠 7. Session & Guest Context Integration

**Purpose:** Personalize flight plan by invite visibility.

**TODO**

- [ ] On page load, fetch guest data from Sheets using session phone + name.
- [ ] Determine invite scope: BHOPAL_ONLY / AYODHYA_ONLY / BOTH.
- [ ] Gate visibility of legs and dates accordingly.
- [ ] If session missing, show default generic schedule with RSVP prompt.
- [ ] Respect privacy (no personal data exposed client-side).

**Commit:**  
`feat(travel-flights): gate flight itinerary by session-based guest context`

---

### 📱 8. UI/UX & Accessibility

**TODO**

- [ ] Fully responsive design (mobile-first).
- [ ] Large tap targets for search buttons.
- [ ] Use accessible labels for date pickers.
- [ ] Keyboard navigation through legs.
- [ ] Add skeleton loaders for data fetching.

**Commit:**  
`feat(travel-flights): polish UI for accessibility and mobile responsiveness`

---

### 🧾 9. Planner Guidance Section

**Purpose:** Contextual tips for arrival/departure planning.

**TODO**

- [ ] Add planner text block:
  - “Arrive in Bhopal by Nov 21 morning for Tilak.”
  - “Reach Ayodhya by Nov 25 noon for the main wedding.”
  - “Depart after Vidai on Nov 26 afternoon.”
- [ ] Highlight critical ceremonies with icons or emojis.
- [ ] Optional “Download My Travel Sheet” button linking to PDF export.

**Commit:**  
`feat(travel-flights): add planner guidance and ceremony-based notes`

---

### 📊 10. QA

**TODO**

- [ ] Track clicks on:
  - Origin input
  - Each deeplink button
  - “Reset to Recommended”
- [ ] smoke test:
  - Default guest flow (session)
  - Non-session fallback
- [ ] Validate date badges render correctly.
- [ ] Add Lighthouse CI performance check (>85).
- [ ] Manual testing checklist

| Area          | Manual Test Steps                       | Expected Outcome           |
| ------------- | --------------------------------------- | -------------------------- |
| Origin Input  | Type “Dubai” / “DXB”; select suggestion | Origin resolves to DXB     |
| RSVP Scope    | Logged guest vs no session              | Correct legs shown         |
| Dates         | Change date → Check link updates        | Deeplink updates instantly |
| Deeplinks     | Click Google/Skyscanner buttons         | Opens correct search tab   |
| Validation    | Try invalid sequence                    | Error message appears      |
| Mobile        | Resize or test on phone                 | Layout collapses cleanly   |
| Planner Notes | Check arrival/departure tips            | Match itinerary logic      |
| Accessibility | Tab through inputs/buttons              | All focusable & readable   |

**Commit:**  
`chore(travel-flights): add analytics tracking and QA coverage`

---

## 📁 Folder Structure

app/travel/flights/page.tsx
components/travel/flights/
├─ OriginInput.tsx
├─ FlightLegCard.tsx
├─ FlightTimeline.tsx
├─ FlightLinks.tsx
└─ PlannerTips.tsx
lib/flights.ts # build links, normalize origin, generate legs
