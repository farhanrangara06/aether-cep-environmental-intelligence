import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { useData } from '../context/DataContext'
import { aqiColor, usAqiBand } from '../lib/aqi'
import { fmt, fmtInt } from '../lib/format'

export function MapView() {
  const { snapshots } = useData()
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return snapshots.filter((row) =>
      !s || `${row.city.name} ${row.city.country} ${row.city.region}`.toLowerCase().includes(s),
    )
  }, [q, snapshots])
  const active = snapshots.find((s) => s.city.id === selected) ?? filtered[0]

  return (
    <div className="grid grid-2">
      <div className="card span-2" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>Live US AQI · world observation grid</h3>
          <input className="search" placeholder="Search city, country, region" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="leaflet-map">
          <MapContainer center={[20, 20]} zoom={2} minZoom={2} worldCopyJump style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap · Air: CAMS / Open-Meteo'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((row) => {
              const aqi = row.air?.us_aqi ?? 0
              return (
                <CircleMarker
                  key={row.city.id}
                  center={[row.city.lat, row.city.lon]}
                  radius={row.air ? 9 : 5}
                  pathOptions={{ color: aqiColor(aqi), fillColor: aqiColor(aqi), fillOpacity: 0.85, weight: 1 }}
                  eventHandlers={{ click: () => setSelected(row.city.id) }}
                >
                  <Popup>
                    <strong>{row.city.name}</strong>
                    <div>{row.city.country}</div>
                    <div>US AQI {fmtInt(row.air?.us_aqi ?? Number.NaN)} · PM2.5 {fmt(row.air?.pm2_5 ?? Number.NaN)}</div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
          {[0, 75, 125, 175, 250, 350].map((v) => (
            <span key={v} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i style={{ width: 10, height: 10, borderRadius: 99, background: aqiColor(v), display: 'inline-block' }} />
              {usAqiBand(v).label}
            </span>
          ))}
        </div>
      </div>
      {active && (
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>{active.city.name} inspector</h3>
          <div className="grid grid-4">
            {[
              ['US AQI', fmtInt(active.air?.us_aqi ?? Number.NaN)],
              ['PM2.5', `${fmt(active.air?.pm2_5 ?? Number.NaN)} µg/m³`],
              ['PM10', `${fmt(active.air?.pm10 ?? Number.NaN)} µg/m³`],
              ['Ozone', `${fmt(active.air?.ozone ?? Number.NaN)} µg/m³`],
              ['NO₂', `${fmt(active.air?.nitrogen_dioxide ?? Number.NaN)} µg/m³`],
              ['SO₂', `${fmt(active.air?.sulphur_dioxide ?? Number.NaN)} µg/m³`],
              ['CO', `${fmt(active.air?.carbon_monoxide ?? Number.NaN, 0)} µg/m³`],
              ['Temp', `${fmt(active.weather?.temperature_2m ?? Number.NaN)} °C`],
            ].map(([k, v]) => (
              <div key={k} className="kpi">
                <div className="label">{k}</div>
                <div className="value" style={{ fontSize: 22 }}>{v}</div>
              </div>
            ))}
          </div>
          {active.air && <p style={{ color: 'var(--muted)' }}>{usAqiBand(active.air.us_aqi).advice}</p>}
        </div>
      )}
    </div>
  )
}
