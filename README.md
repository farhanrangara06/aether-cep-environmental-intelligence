# Aether — Environmental Intelligence

Aether is a SaaS-style environmental operations console.

Live air quality is **Copernicus Atmosphere Monitoring Service (CAMS / ECMWF)** via the [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api). Weather is Open-Meteo. Background CO₂ is **NOAA Global Monitoring Laboratory, Mauna Loa**.

## Product surfaces

- Landing + control room
- Global 51-city observation grid and dark-basemap
- Hourly pollutant analytics and city compare
- Campus IoT mesh (PMS5003 / MQ / BME class nodes) fused to the nearest CAMS hub
- Alert queue vs AQI and WHO PM2.5 (15 µg/m³)
- Platform: architecture, data sources, methodology

Live repo: [farhanrangara06/aether-cep-environmental-intelligence](https://github.com/farhanrangara06/aether-cep-environmental-intelligence)

## Deploy on Netlify

The repo already includes `netlify.toml` (build command + SPA redirects).

1. Log in: `npx netlify-cli login`
2. Ship the production folder: `npx netlify-cli deploy --prod --dir=dist`
3. Or in the Netlify UI: **Add new site → Import an existing project → GitHub** and pick this repository. Build command `npm run build`, publish directory `dist`.

## Scripts

React 19, TypeScript, Vite, Recharts, Leaflet. Hosted as a static SPA.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Deploy

Netlify publishes `dist` (`netlify.toml`). SPA fallback is configured so `/app/*` routes work.
