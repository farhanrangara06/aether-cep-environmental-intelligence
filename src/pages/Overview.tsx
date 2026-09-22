import { useMemo, useState } from 'react'
import { useData, useKpis } from '../context/DataContext'
import { aqiColor, usAqiBand } from '../lib/aqi'
import { fmt, fmtInt, observedAt } from '../lib/format'
import { CO2_CURRENT, CO2_MONTHLY, GLOBAL_TEMP } from '../data/climate'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CitySnapshot } from '../lib/api'

type SortKey = 'name' | 'aqi' | 'pm25' | 'no2' | 'temp' | 'time'

export function Overview() {
  const { snapshots, loading } = useData()
  const k = useKpis(snapshots)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('aqi')
  const region = useMemo(() => {
    const map = new Map<string, number[]>()
    snapshots.forEach((s) => {
      if (!s.air) return
      const arr = map.get(s.city.region) ?? []
      arr.push(s.air.us_aqi)
      map.set(s.city.region, arr)
    })
    return [...map.entries()].map(([regionName, vals]) => ({
      region: regionName,
      aqi: vals.reduce((a, b) => a + b, 0) / vals.length,
    }))
  }, [snapshots])

  const liveRows = useMemo(() => {
    const s = q.trim().toLowerCase()
    const rows = snapshots.filter(
      (row) => !s || `${row.city.name} ${row.city.country} ${row.city.region}`.toLowerCase().includes(s),
    )
    const val = (row: CitySnapshot) => {
      if (sort === 'name') return row.city.name
      if (sort === 'aqi') return row.air?.us_aqi ?? -1
      if (sort === 'pm25') return row.air?.pm2_5 ?? -1
      if (sort === 'no2') return row.air?.nitrogen_dioxide ?? -1
      if (sort === 'temp') return row.weather?.temperature_2m ?? -999
      return row.air?.time ?? ''
    }
    return [...rows].sort((a, b) => {
      const va = val(a)
      const vb = val(b)
      if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb)
      return (vb as number) - (va as number)
    })
  }, [q, sort, snapshots])

  if (loading && !snapshots.some((s) => s.air)) {
    return (
      <div className="grid grid-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="card" key={i}><div className="skeleton" /></div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-4">
        <div className="card kpi">
          <div className="label">Grid-mean AQI</div>
          <div className="value">{fmtInt(k.avgAqi)}</div>
          <div className="hint">{k.coverage}/{snapshots.length} cities live · CAMS nowcast</div>
        </div>
        <div className="card kpi">
          <div className="label">Mean PM2.5</div>
          <div className="value">{fmt(k.avgPm25)} <span style={{ fontSize: 14, color: 'var(--muted)' }}>µg/m³</span></div>
          <div className="hint">WHO 24h guideline is 15 µg/m³</div>
        </div>
        <div className="card kpi">
          <div className="label">Cities unhealthy+</div>
          <div className="value" style={{ color: k.unhealthy ? 'var(--warn)' : 'var(--mint)' }}>{k.unhealthy}</div>
          <div className="hint">AQI greater than 100</div>
        </div>
        <div className="card kpi">
          <div className="label">Mauna Loa CO₂</div>
          <div className="value">{fmt(CO2_CURRENT.ppm, 2)}</div>
          <div className="hint">{CO2_CURRENT.asOf} · NOAA GML daily</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Live feed · every city</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input className="search" placeholder="Filter cities" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="search" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="aqi">Sort by AQI</option>
              <option value="pm25">Sort by PM2.5</option>
              <option value="no2">Sort by NO₂</option>
              <option value="temp">Sort by temp</option>
              <option value="name">Sort by name</option>
              <option value="time">Sort by observation time</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>City</th>
                <th>Region</th>
                <th>AQI</th>
                <th>PM2.5</th>
                <th>PM10</th>
                <th>O₃</th>
                <th>NO₂</th>
                <th>Temp</th>
                <th>Observed</th>
                <th>Band</th>
              </tr>
            </thead>
            <tbody>
              {liveRows.map((s) => {
                const band = usAqiBand(s.air?.us_aqi ?? 0)
                return (
                  <tr key={s.city.id}>
                    <td>
                      {s.city.name}
                      <div className="mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{s.city.country}</div>
                    </td>
                    <td>{s.city.region}</td>
                    <td className="mono" style={{ color: aqiColor(s.air?.us_aqi ?? 0) }}>{fmtInt(s.air?.us_aqi ?? Number.NaN)}</td>
                    <td className="mono">{fmt(s.air?.pm2_5 ?? Number.NaN)}</td>
                    <td className="mono">{fmt(s.air?.pm10 ?? Number.NaN)}</td>
                    <td className="mono">{fmt(s.air?.ozone ?? Number.NaN)}</td>
                    <td className="mono">{fmt(s.air?.nitrogen_dioxide ?? Number.NaN)}</td>
                    <td className="mono">{fmt(s.weather?.temperature_2m ?? Number.NaN)}°</td>
                    <td className="mono" style={{ color: 'var(--muted)' }}>{observedAt(s.air?.time ?? s.weather?.time)}</td>
                    <td>
                      <span className="badge" style={{ background: s.air ? band.color : '#44554c' }}>
                        {s.air ? band.label : 'syncing'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Hottest pollution nodes</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>City</th>
                  <th>AQI</th>
                  <th>PM2.5</th>
                  <th>NO₂</th>
                  <th>Band</th>
                </tr>
              </thead>
              <tbody>
                {k.ranked.slice(0, 8).map((s) => {
                  const band = usAqiBand(s.air?.us_aqi ?? 0)
                  return (
                    <tr key={s.city.id}>
                      <td>
                        {s.city.name}
                        <div className="mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{s.city.country}</div>
                      </td>
                      <td className="mono">{fmtInt(s.air?.us_aqi ?? Number.NaN)}</td>
                      <td className="mono">{fmt(s.air?.pm2_5 ?? Number.NaN)}</td>
                      <td className="mono">{fmt(s.air?.nitrogen_dioxide ?? Number.NaN)}</td>
                      <td>
                        <span className="badge" style={{ background: band.color }}>{band.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <h3>Cleanest air right now</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>City</th>
                  <th>AQI</th>
                  <th>PM2.5</th>
                </tr>
              </thead>
              <tbody>
                {[...k.ranked].reverse().slice(0, 8).map((s) => (
                  <tr key={s.city.id}>
                    <td>{s.city.name}</td>
                    <td className="mono" style={{ color: aqiColor(s.air?.us_aqi ?? 0) }}>{fmtInt(s.air?.us_aqi ?? Number.NaN)}</td>
                    <td className="mono">{fmt(s.air?.pm2_5 ?? Number.NaN)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Regional mean AQI</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={region}>
                <CartesianGrid stroke="rgba(130,214,176,0.08)" vertical={false} />
                <XAxis dataKey="region" tick={{ fill: '#8aa89a', fontSize: 11 }} interval={0} angle={-18} height={50} />
                <YAxis tick={{ fill: '#8aa89a', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#10231e', border: '1px solid rgba(130,214,176,0.2)' }} />
                <Bar dataKey="aqi" fill="#3ee0a3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3>NOAA Mauna Loa CO₂ trajectory</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CO2_MONTHLY}>
                <defs>
                  <linearGradient id="co2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7cf0c4" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#7cf0c4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(130,214,176,0.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#8aa89a', fontSize: 11 }} />
                <YAxis domain={[416, 430]} tick={{ fill: '#8aa89a', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#10231e', border: '1px solid rgba(130,214,176,0.2)' }} />
                <Area type="monotone" dataKey="ppm" stroke="#3ee0a3" fill="url(#co2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 12, margin: '8px 0 0' }}>
            Monthly mean Aug 2026: {CO2_CURRENT.monthly} ppm (vs {CO2_CURRENT.yoyMonthly} in Aug 2025).
            Global temperature context: +{GLOBAL_TEMP.anomalyC} °C vs 1951–1980 baseline.
          </p>
        </div>
      </div>
    </>
  )
}
