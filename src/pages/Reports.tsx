import { CO2_CURRENT } from '../data/climate'

export function Reports() {
  return (
    <div className="grid">
      <div className="card">
        <h3>About Aether</h3>
        <p>
          Aether is an environmental operations platform that treats the atmosphere as a live dataset.
          Low-cost site sensors answer “what is happening on our grounds?” Copernicus CAMS via
          Open-Meteo answers “what is happening on Earth?” Analytics turn both into decisions — who
          is exposed, where to site a sensor, when to alert.
        </p>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <h3>Problem</h3>
          <p style={{ color: 'var(--muted)' }}>
            Air pollution and climate stress are uneven, fast-moving, and poorly visible to campus
            administrators. Spreadsheet logs and single-station AQI widgets do not support comparison,
            forecasting, or incident response.
          </p>
        </div>
        <div className="card">
          <h3>Objectives</h3>
          <ul style={{ color: 'var(--muted)', margin: 0, paddingLeft: 18 }}>
            <li>Ingest multi-pollutant observations (PM2.5, PM10, O₃, NO₂, SO₂, CO).</li>
            <li>Visualize a planetary grid with honest source attribution.</li>
            <li>Fuse a campus IoT mesh with the same analytics layer.</li>
            <li>Score risk against AQI and WHO PM2.5 guidelines.</li>
          </ul>
        </div>
      </div>
      <div className="card">
        <h3>System architecture</h3>
        <p className="mono" style={{ color: 'var(--mint-2)', lineHeight: 1.7 }}>
          Sensors (PMS5003 / SDS011 / MQ-series / BME280)
          → MCU (ESP32) → MQTT
          → Feature store
          → Aether Control (this SPA)
          ← Open-Meteo Air Quality (CAMS / ECMWF)
          ← Open-Meteo Weather
          ← NOAA GML CO₂ (Mauna Loa)
        </p>
      </div>
      <div className="grid grid-3">
        <div className="card">
          <h3>Data ethics</h3>
          <p style={{ color: 'var(--muted)' }}>
            City dots are model-based CAMS samples at lat/lon, not a claim of a physical EPA station
            on every corner. NOAA CO₂ is observatory truth ({CO2_CURRENT.ppm} ppm on {CO2_CURRENT.asOf}).
          </p>
        </div>
        <div className="card">
          <h3>Tech stack</h3>
          <p style={{ color: 'var(--muted)' }}>
            TypeScript, React 19, Vite, Recharts, Leaflet. Static host on Netlify. No secret API keys —
            the public CAMS gateway is enough for a production console.
          </p>
        </div>
        <div className="card">
          <h3>Future work</h3>
          <p style={{ color: 'var(--muted)' }}>
            MQTT live campus ingest, OpenAQ station overlay, wildfire thermal anomalies, and a
            calibration model that learns sensor bias versus CAMS residuals.
          </p>
        </div>
      </div>
    </div>
  )
}
