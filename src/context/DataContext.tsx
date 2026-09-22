import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CITIES } from '../data/cities'
import { loadWorldGrid, type CitySnapshot } from '../lib/api'
import { mean } from '../lib/format'

const REFRESH_MS = 90_000

type DataState = {
  loading: boolean
  refreshing: boolean
  error: string | null
  snapshots: CitySnapshot[]
  refreshedAt: string | null
  refresh: () => void
}

const Ctx = createContext<DataState | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [snapshots, setSnapshots] = useState<CitySnapshot[]>([])
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const hasData = useRef(false)

  useEffect(() => {
    let cancelled = false
    const first = !hasData.current
    if (first) setLoading(true)
    else setRefreshing(true)
    setError(null)
    loadWorldGrid()
      .then((rows) => {
        if (cancelled) return
        hasData.current = true
        setSnapshots(rows)
        setRefreshedAt(new Date().toISOString())
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load live environmental feeds')
        if (first) setSnapshots(CITIES.map((city) => ({ city, air: null, weather: null, hourly: null })))
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
        setRefreshing(false)
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), REFRESH_MS)
    return () => window.clearInterval(id)
  }, [])

  const value = useMemo(
    () => ({
      loading,
      refreshing,
      error,
      snapshots,
      refreshedAt,
      refresh: () => setTick((n) => n + 1),
    }),
    [loading, refreshing, error, snapshots, refreshedAt],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useData() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}

export function useKpis(snapshots: CitySnapshot[]) {
  const aqi = snapshots.map((s) => s.air?.us_aqi ?? Number.NaN).filter(Number.isFinite)
  const pm = snapshots.map((s) => s.air?.pm2_5 ?? Number.NaN).filter(Number.isFinite)
  const ranked = [...snapshots].filter((s) => s.air).sort((a, b) => (b.air?.us_aqi ?? 0) - (a.air?.us_aqi ?? 0))
  return {
    avgAqi: mean(aqi),
    avgPm25: mean(pm),
    unhealthy: aqi.filter((v) => v > 100).length,
    coverage: snapshots.filter((s) => s.air).length,
    worst: ranked[0] ?? null,
    best: ranked.at(-1) ?? null,
    ranked,
  }
}
