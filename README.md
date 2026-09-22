# Aether — Environmental Intelligence

College CEP **43. Environmental Monitoring Using Sensors & Data Analytics**, built as a real SaaS-style operations console.

Live air quality is **Copernicus Atmosphere Monitoring Service (CAMS / ECMWF)** via the [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api). Weather is Open-Meteo. Background CO₂ is **NOAA Global Monitoring Laboratory, Mauna Loa**.

## Product surfaces

- Landing + control room
- Global 51-city observation grid and dark-basemap
- Hourly pollutant analytics and city compare
- Campus IoT mesh (PMS5003 / MQ / BME class nodes) fused to the nearest CAMS hub
- Alert queue vs US AQI and WHO PM2.5 (15 µg/m³)
- CEP dossier: problem, objectives, architecture

## Stack

React 19, TypeScript, Vite, Recharts, Leaflet. Hosted as a static SPA.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Deploy

Netlify publishes `dist` (`netlify.toml`). SPA fallback is configured so `/app/*` routes work.
