import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import { fmt } from '../lib/format'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function Analytics() {
  const { snapshots } = useData()
  const live = snapshots.filter((s) => s.hourly)
  const [a, setA] = useState('del')
  const [b, setB] = useState('lon')
  const cityA = live.find((s) => s.city.id === a) ?? live[0]
  const cityB = live.find((s) => s.city.id === b) ?? live[1]

  const series = useMemo(() => {
    if (!cityA?.hourly) return []
    return cityA.hourly.time.slice(0, 48).map((t, i) => ({
      t: t.slice(11, 16),
      full: t,
      aqi: cityA.hourly?.us_aqi[i],
      pm25: cityA.hourly?.pm2_5[i],
      o3: cityA.hourly?.ozone[i],
      no2: cityA.hourly?.nitrogen_dioxide[i],
    }))
  }, [cityA])

  const compare = useMemo(() => {
    if (!cityA?.hourly || !cityB?.hourly) return []
    const n = Math.min(24, cityA.hourly.time.length, cityB.hourly.time.length)
    return Array.from({ length: n }, (_, i) => ({
      t: cityA.hourly!.time[i].slice(11, 16),
      [cityA.city.name]: cityA.hourly!.us_aqi[i],
      [cityB.city.name]: cityB.hourly!.us_aqi[i],
    }))
  }, [cityA, cityB])

  if (!cityA) return <div className="card">Waiting for hourly CAMS series…</div>

  return (
    <>
      <div className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <label>
          Focus city{' '}
          <select className="search" value={cityA.city.id} onChange={(e) => setA(e.target.value)}>
            {live.map((s) => (
              <option key={s.city.id} value={s.city.id}>{s.city.name}</option>
            ))}
          </select>
        </label>
        <label>
          Compare{' '}
          <select className="search" value={cityB?.city.id ?? ''} onChange={(e) => setB(e.target.value)}>
            {live.map((s) => (
              <option key={s.city.id} value={s.city.id}>{s.city.name}</option>
            ))}
          </select>
        </label>
        <span className="pill">48-hour CAMS forecast + nowcast</span>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>{cityA.city.name} · pollutants</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid stroke="rgba(130,214,176,0.08)" />
                <XAxis dataKey="t" tick={{ fill: '#8aa89a', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8aa89a', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#10231e', border: '1px solid rgba(130,214,176,0.2)' }} />
                <Legend />
                <Line type="monotone" dataKey="pm25" name="PM2.5" stroke="#3ee0a3" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="o3" name="O₃" stroke="#7cb8ff" dot={false} />
                <Line type="monotone" dataKey="no2" name="NO₂" stroke="#f4a04a" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3>US AQI compare · next 24h</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={compare}>
                <CartesianGrid stroke="rgba(130,214,176,0.08)" />
                <XAxis dataKey="t" tick={{ fill: '#8aa89a', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8aa89a', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#10231e', border: '1px solid rgba(130,214,176,0.2)' }} />
                <Legend />
                <Line type="monotone" dataKey={cityA.city.name} stroke="#3ee0a3" dot={false} strokeWidth={2} />
                {cityB && <Line type="monotone" dataKey={cityB.city.name} stroke="#b56bff" dot={false} strokeWidth={2} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Nowcast snapshot</h3>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>
          {cityA.city.name}: PM2.5 {fmt(cityA.air?.pm2_5 ?? Number.NaN)} µg/m³ · humidity {fmt(cityA.weather?.relative_humidity_2m ?? Number.NaN, 0)}% · wind {fmt(cityA.weather?.wind_speed_10m ?? Number.NaN)} km/h
        </p>
      </div>
    </>
  )
}
