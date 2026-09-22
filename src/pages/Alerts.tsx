import { useMemo } from 'react'
import { useData, useKpis } from '../context/DataContext'
import { usAqiBand } from '../lib/aqi'
import { fmt, fmtInt } from '../lib/format'

export function Alerts() {
  const { snapshots } = useData()
  const k = useKpis(snapshots)
  const items = useMemo(() => {
    return k.ranked
      .filter((s) => (s.air?.us_aqi ?? 0) >= 100 || (s.air?.pm2_5 ?? 0) >= 15)
      .slice(0, 18)
      .map((s) => {
        const aqi = s.air?.us_aqi ?? 0
        const band = usAqiBand(aqi)
        const who = (s.air?.pm2_5 ?? 0) >= 15
        return {
          id: s.city.id,
          title: `${s.city.name} · ${band.label}`,
          body: who
            ? `PM2.5 ${fmt(s.air?.pm2_5 ?? Number.NaN)} µg/m³ exceeds WHO 24h guideline (15). AQI ${fmtInt(aqi)}.`
            : `AQI ${fmtInt(aqi)} (${band.range}). ${band.advice}`,
          color: band.color,
          sev: aqi >= 150 ? 'P1' : aqi >= 100 ? 'P2' : 'P3',
        }
      })
  }, [k.ranked])

  return (
    <>
      <div className="grid grid-3">
        <div className="card kpi">
          <div className="label">Open incidents</div>
          <div className="value">{items.length}</div>
          <div className="hint">Derived from live grid, not synthetic spam</div>
        </div>
        <div className="card kpi">
          <div className="label">P1 / very unhealthy+</div>
          <div className="value">{items.filter((i) => i.sev === 'P1').length}</div>
          <div className="hint">AQI ≥ 150</div>
        </div>
        <div className="card kpi">
          <div className="label">WHO PM2.5 breaches</div>
          <div className="value">{k.ranked.filter((s) => (s.air?.pm2_5 ?? 0) >= 15).length}</div>
          <div className="hint">Guideline 15 µg/m³ (24h)</div>
        </div>
      </div>
      <div className="card">
        <h3>Queue</h3>
        {items.length === 0 && <p style={{ color: 'var(--muted)' }}>All sampled cities are currently below alert thresholds.</p>}
        {items.map((i) => (
          <div className="alert-row" key={i.id}>
            <span className="dot" style={{ background: i.color }} />
            <div>
              <div style={{ fontWeight: 600 }}>
                {i.sev} · {i.title}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>{i.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
