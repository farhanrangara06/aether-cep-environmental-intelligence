import { Link } from 'react-router-dom'
import { ArrowRight, Database, Globe2, Radio, Shield } from 'lucide-react'

export function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand" style={{ padding: 0 }}>
          <div className="brand-mark" style={{ width: 36, height: 36 }}>A</div>
          <div>
            <h1>AETHER</h1>
            <p>Environmental intelligence</p>
          </div>
        </div>
        <Link className="btn primary" to="/app">
          Open control room <ArrowRight size={16} />
        </Link>
      </nav>

      <section className="hero">
        <span className="pill">Live Copernicus CAMS · NOAA CO₂ · IoT mesh</span>
        <h1>See the planet breathe. Act before the air turns.</h1>
        <p>
          Aether is a SaaS-style environmental operations platform. It fuses a campus IoT mesh with
          global air-quality fields from ECMWF Copernicus Atmosphere Monitoring Service, served
          through Open-Meteo, plus NOAA Mauna Loa carbon dioxide.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
          <Link className="btn primary" to="/app">
            Launch live dashboard
          </Link>
          <Link className="btn" to="/app/reports">
            How Aether works
          </Link>
        </div>
        <div className="hero-stats">
          <div className="card kpi">
            <div className="label">Observation grid</div>
            <div className="value">51</div>
            <div className="hint">cities across 6 continents</div>
          </div>
          <div className="card kpi">
            <div className="label">Primary source</div>
            <div className="value" style={{ fontSize: 22 }}>CAMS</div>
            <div className="hint">hourly PM2.5, O₃, NO₂, AQI</div>
          </div>
          <div className="card kpi">
            <div className="label">CO₂ (NOAA)</div>
            <div className="value" style={{ fontSize: 28 }}>425.6</div>
            <div className="hint">ppm · Mauna Loa · 14 Sep 2026</div>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        {[
          { icon: Globe2, t: 'Whole-world coverage', d: 'Not a mock map — live CAMS samples at global megacities, updated on demand.' },
          { icon: Radio, t: 'Sensor + satellite fusion', d: 'Campus nodes (PM, gas, climate) sit on the same ops canvas as planetary fields.' },
          { icon: Database, t: 'Analytics workspace', d: 'Hourly series, city compare, AQI risk scoring, and exportable tables.' },
          { icon: Shield, t: 'Ops-grade UX', d: 'Dark control-room UI, freshness stamps, degraded-mode handling, alert queue.' },
        ].map((f) => (
          <div className="card" key={f.t}>
            <f.icon size={18} color="#3ee0a3" />
            <h3 style={{ marginTop: 10 }}>{f.t}</h3>
            <p style={{ color: 'var(--muted)', margin: 0 }}>{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
