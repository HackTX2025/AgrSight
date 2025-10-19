## AgriSight – Farming Finance from Orbit

### Inspiration ☀️🧺👨‍🌾
Farmers often struggle to connect crop health to finances. Even with satellite imagery or forecasts, it’s hard to translate signals into money decisions. AgriSight bridges that gap with clear, personalized actions like when to save, invest, or apply for microloans.

### What it does 💧💵
AgriSight combines satellite crop signals (NDVI), local weather, and bank data to deliver simple, actionable insights.

Core features:
- 🗺️ NDVI Map: Visualizes field health with red/yellow/green markers and selection state.
- 🌦️ Weather Forecast: 5-day forecast with rainfall and risk summary; robust fallback if the API fails.
- 💰 Financial Dashboard: Balances, recent transactions, summary KPIs, and a Finance Cockpit view.
- 🤖 Smart Recommendations: Contextual guidance, for example:
  - “Save $50 this week → crop stress detected.”
  - “Apply for an emergency microloan → drought ahead.”
  - “Crops healthy → consider investing in new equipment.”

### How we built it 💻
- Frontend: Next.js (React) + Tailwind CSS + Google Maps (satellite view, custom markers)
- Backend: Node.js + Express (routes: /api/fields, /api/analyze, /api/weather, /api/financial, /api/recommend, plus finance helpers)
- APIs:
  - Google Gemini (image analysis placeholder with graceful fallback)
  - OpenWeatherMap (5‑day forecast; grouped and averaged)
  - Capital One Nessie (financial data, mocked where needed)

### Challenges we ran into 💢
- Keeping scope tight in a short hackathon window
- Handling weather API limits and ensuring robust fallbacks
- Ensuring consistent UI semantics across map markers, cards, and modals

### Accomplishments we’re proud of ‼️
- End‑to‑end prototype: backend + frontend integrated
- Map-first workflow with satellite-only view and stable interactions
- Clear financial messaging tied to agronomic signals

### What’s next for AgriSight ⏭️
- Live NDVI ingestion from public satellite datasets (e.g., Sentinel‑2)
- SMS/WhatsApp alerts for time‑sensitive actions
- Deeper bank integrations (Capital One and beyond) for live balances and offers

---

## Local Development

### 1) Backend (port 3002)
Create `daydream-dental-clone-main/backend/.env`:
```
PORT=3002
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_KEY
GEMINI_API_KEY=YOUR_GEMINI_KEY
NESSIE_API_KEY=YOUR_NESSIE_KEY
```
Then:
```
cd daydream-dental-clone-main/backend
npm install
node server.js
# Health check → http://localhost:3002/api/health
```

### 2) Frontend (Next.js)
Create `daydream-dental-clone-main/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_KEY
```
Then:
```
cd daydream-dental-clone-main
npm install
npm run dev
```

If you see HTML on API calls or 404s, ensure the frontend points to port 3002 and the backend is running.
