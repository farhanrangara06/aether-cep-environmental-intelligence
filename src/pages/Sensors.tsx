import { useMemo } from 'react'
import { useData } from '../context/DataContext'
import { fmt } from '../lib/format'

const NODES = [
  { id: 'AQ-01', name: 'Quad lawn', kind: 'PMS5003 + BME280', dx: 0.01, dy: 0.008 },
  { id: 'AQ-02', name: 'Highway edge', kind: 'PMS5003 + MQ135', dx: -0.012, dy: 0.004 },
  { id: 'AQ-03', name: 'Lab rooftop', kind: 'SDS011 + DHT22', dx: 0.006, dy: -0.01 },
  { id: 'GHG-1', name: 'Boiler stack line', kind: 'MQ7 + MQ135', dx: -0.008, dy: -0.012 },
  { id: 'MET-1', name: 'Met mast', kind: 'BME280 + anemometer', dx: 0.015, dy: -0.002 },
  { id: 'UV-01', name: 'Sports court', kind: 'VEML6075', dx: 0.002, dy: 0.014 },
]

export function Sensors() {
  const { snapshots } = useData()
  const hub = snapshots.find((s) => s.city.id === 'del') ?? snapshots.find((s) => s.air) ?? snapshots[0]
  const rows = useMemo(() => {
    const pm = hub?.air?.pm2_5 ?? 35
    const no2 = hub?.air?.nitrogen_dioxide ?? 20
    const t = hub?.weather?.temperature_2m ?? 28
    const h = hub?.weather?.relative_humidity_2m ?? 55
    return NODES.map((n, i) => {
      const jitter = ((i + 1) * 7) % 5
      return {
        ...n,
        online: i !== 4 || (hub?.air?.us_aqi ?? 0) < 250,
        pm25: Math.max(4, pm + jitter - 2),
        no2: Math.max(2, no2 + jitter),
        temp: t + (i % 3) - 1,
        rh: Math.min(99, h + jitter),
        lat: (hub?.city.lat ?? 28.61) + n.dy,
        lon: (hub?.city.lon ?? 77.21) + n.dx,
      }
    })
  }, [hub])

  return (
    <>
      <div className="card">
        <h3>Campus mesh fused to {hub?.city.name ?? 'hub'} CAMS nowcast</h3>
        <p style={{ color: 'var(--muted)' }}>
          Hardware layer for the CEP: low-cost optical particle counters, metal-oxide gas sensors, and
          climate probes. Readings are anchored to the live Open-Meteo/CAMS field for the nearest hub
          city so the mesh stays physically plausible, then locally offset the way a real calibration
          layer would.
        </p>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Node</th>
                <th>Placement</th>
                <th>Stack</th>
                <th>PM2.5</th>
                <th>NO₂ proxy</th>
                <th>Temp</th>
                <th>RH</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((n) => (
                <tr key={n.id}>
                  <td className="mono">{n.id}</td>
                  <td>{n.name}</td>
                  <td>{n.kind}</td>
                  <td className="mono">{fmt(n.pm25)}</td>
                  <td className="mono">{fmt(n.no2)}</td>
                  <td className="mono">{fmt(n.temp)}°C</td>
                  <td className="mono">{fmt(n.rh, 0)}%</td>
                  <td>
                    <span className="badge" style={{ background: n.online ? '#3ee0a3' : '#ef5b5b' }}>
                      {n.online ? 'online' : 'calibrating'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-3">
        {[
          ['Ingest', 'MQTT → time-series store → feature store. This demo uses HTTPS CAMS as the planetary bus.'],
          ['QA / QC', 'Range checks, stuck-sensor detection, and hub-city residual vs CAMS.'],
          ['Actuation', 'Alerts fire when US AQI > 100 or PM2.5 exceeds the WHO 24h guideline.'],
        ].map(([t, d]) => (
          <div className="card" key={t}>
            <h3>{t}</h3>
            <p style={{ color: 'var(--muted)', margin: 0 }}>{d}</p>
          </div>
        ))}
      </div>
    </>
  )
}
