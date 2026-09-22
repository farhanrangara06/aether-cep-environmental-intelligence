import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity,
  Bell,
  Globe2,
  LayoutDashboard,
  Leaf,
  Radio,
  RefreshCw,
  ScrollText,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { timeAgo } from '../lib/format'

const links = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/map', label: 'Live map', icon: Globe2 },
  { to: '/app/analytics', label: 'Analytics', icon: Activity },
  { to: '/app/sensors', label: 'Sensor mesh', icon: Radio },
  { to: '/app/alerts', label: 'Alerts', icon: Bell },
  { to: '/app/reports', label: 'Platform', icon: ScrollText },
]

const titles: Record<string, { t: string; d: string }> = {
  '/app': { t: 'Mission control', d: 'Live planetary air quality, climate, and campus sensing.' },
  '/app/map': { t: 'Global observation grid', d: 'Copernicus CAMS fields sampled at 51 world cities.' },
  '/app/analytics': { t: 'Environmental analytics', d: 'Hourly pollutants, city comparison, and trend intelligence.' },
  '/app/sensors': { t: 'IoT sensor mesh', d: 'Campus nodes fused with the global monitoring backbone.' },
  '/app/alerts': { t: 'Risk & alerts', d: 'Threshold breaches generated from live AQI and PM2.5.' },
  '/app/reports': { t: 'Platform', d: 'Architecture, data sources, and how the operations stack is built.' },
}

export function AppLayout() {
  const { refreshedAt, loading, refreshing, refresh, error } = useData()
  const loc = useLocation()
  const meta = titles[loc.pathname] ?? titles['/app']

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <div className="brand-mark">
            <Leaf size={20} />
          </div>
          <div>
            <h1>AETHER</h1>
            <p>Control</p>
          </div>
        </NavLink>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <l.icon size={16} />
            {l.label}
          </NavLink>
        ))}
        <div className="sidebar-foot">
          Workspace · Production
          <div className="mono" style={{ marginTop: 6, color: 'var(--mint-2)' }}>
            Aether Control
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="page-title">
            <h2>{meta.t}</h2>
            <p>{meta.d}</p>
          </div>
          <div className="top-actions">
            <span className="pill">
              <span className="pulse" />
              {loading ? 'Syncing CAMS' : refreshing ? 'Refreshing' : error ? 'Degraded' : 'Live · auto 90s'}
            </span>
            <span className="pill mono">{timeAgo(refreshedAt ?? undefined)}</span>
            <button className="btn" onClick={refresh} type="button">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </header>
        <main className="content">
          {error && (
            <div className="card" style={{ borderColor: 'rgba(239,91,91,0.4)' }}>
              Could not reach Open-Meteo / Copernicus CAMS ({error}). Check the network and retry.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
