# Porto26 — Project Context

## What this is
A mobile-first React web app: a Porto travel guide for a group trip. It has six sections — SPEAK, EAT, DRINK, WATCH, DO, GAFF — each colour-coded and navigable from a home screen.

## Stack
- React 18 + React Router v6 (HashRouter)
- Vite 5
- `@react-google-maps/api` for maps
- `papaparse` for CSV
- Global CSS (no CSS-in-JS, no Tailwind)
- Static JSON/CSV content files served via a Vite middleware plugin

## Project structure
```
src/
  App.jsx               # Routes: /, /speak, /eat, /drink, /watch, /do, /gaff
  main.jsx
  index.css             # All styles — CSS variables for accent colours
  components/
    BackButton.jsx
    CardPage.jsx         # Shared template for EAT / DRINK / WATCH / DO
    MapView.jsx          # Google Maps with custom cream palette + geolocation
    PaniniCard.jsx       # Individual sticker-style card
  pages/
    Home.jsx
    Speak.jsx            # CSV-backed phrase book with audio playback
    Eat.jsx  Drink.jsx  Watch.jsx  Do.jsx
    Gaff.jsx             # Apartment details
  utils/
    shuffle.js           # Fisher-Yates (non-mutating)
    csv.js               # fetchCSV() via PapaParse

content/
  people.json           # 3 local guide profiles
  apartment.json        # Gaff details + coordinates
  eat/restaurants.json
  drink/bars.json
  watch/venues.json
  do/do.json
  speak/phrases.csv
```

## Colour scheme
| Section | Accent      |
|---------|-------------|
| SPEAK   | #1A3A8F (blue)   |
| EAT     | #2A7A3B (green)  |
| DRINK   | #F5C518 (gold)   |
| WATCH   | #D42B2B (red)    |
| DO      | #E87722 (orange) |
| GAFF    | #00A896 (teal)   |

Background cream: `#F5EDD6`

## Card scroll behaviour (EAT / DRINK / WATCH / DO)
- Peek layout: active card = 75vw, next card peeks ~15% from right, previous card peeks from left once scrolled
- `scroll-snap-type: x mandatory` — snaps card by card
- `scroll-padding-left: 6vw`, card `scroll-snap-align: start`, gap = 4vw
- Card image containers: fixed 200px height, `object-fit: contain`, cream (#F5EDD6) background fills letterboxing
- Description panel below the scroll updates to match active card with 0.2s opacity fade

## Card data logic (CardPage.jsx)
On every page load:
1. Fetch section JSON + `people.json` in parallel
2. Fisher-Yates shuffle the section items
3. Pick a random person from people.json, insert at a random index
4. Active card tracked via `scrollLeft` — step = `el.clientWidth * 0.79`

## Environment
- `.env` contains `VITE_GOOGLE_MAPS_API_KEY`
- Dev server: `npm run dev` → `http://localhost:5173`

## Fonts
Orbitron (headings/labels), Chakra Petch (body), Exo 2 — loaded from Google Fonts.

## Things to keep in mind
- All CSS is in `src/index.css` with CSS custom properties (`--accent`, `--card-accent`) for per-section colours
- No TypeScript — plain JSX throughout
- `public/cards/` holds card images referenced in JSON as `card_image` filename
- Audio files for Speak page are in `public/audio/`
- The Gaff page is static (apartment.json) — no shuffle or person insertion
