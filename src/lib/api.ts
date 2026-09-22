import { CITIES, type City } from '../data/cities'

export type CurrentAir = {
  time: string
  european_aqi: number
  us_aqi: number
  pm2_5: number
  pm10: number
  carbon_monoxide: number
  nitrogen_dioxide: number
  sulphur_dioxide: number
  ozone: number
  uv_index: number
  dust: number
}

export type CurrentWeather = {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  wind_speed_10m: number
  precipitation: number
}

export type HourlySeries = {
  time: string[]
  pm2_5: number[]
  pm10: number[]
  us_aqi: number[]
  ozone: number[]
  nitrogen_dioxide: number[]
}

export type CitySnapshot = {
  city: City
  air: CurrentAir | null
  weather: CurrentWeather | null
  hourly: HourlySeries | null
}

type OpenMeteoAir = {
  current?: CurrentAir
  hourly?: HourlySeries
}

type OpenMeteoWeather = {
  current?: CurrentWeather
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function asArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed ${res.status}`)
  return res.json() as Promise<T>
}

export async function loadWorldGrid(): Promise<CitySnapshot[]> {
  const groups = chunk(CITIES, 18)
  const snapshots: CitySnapshot[] = CITIES.map((city) => ({
    city,
    air: null,
    weather: null,
    hourly: null,
  }))
  const byId = new Map(snapshots.map((s) => [s.city.id, s]))

  await Promise.all(
    groups.map(async (group) => {
      const lat = group.map((c) => c.lat).join(',')
      const lon = group.map((c) => c.lon).join(',')
      const airUrl =
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
        `&current=european_aqi,us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,dust` +
        `&hourly=pm2_5,pm10,us_aqi,ozone,nitrogen_dioxide&forecast_days=2&timezone=auto`
      const wxUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&timezone=auto`

      const [airRaw, wxRaw] = await Promise.all([
        getJson<OpenMeteoAir | OpenMeteoAir[]>(airUrl),
        getJson<OpenMeteoWeather | OpenMeteoWeather[]>(wxUrl),
      ])
      const airList = asArray(airRaw)
      const wxList = asArray(wxRaw)
      group.forEach((city, i) => {
        const row = byId.get(city.id)
        if (!row) return
        row.air = airList[i]?.current ?? null
        row.weather = wxList[i]?.current ?? null
        row.hourly = airList[i]?.hourly ?? null
      })
    }),
  )

  return snapshots
}

export async function loadCityDetail(city: City): Promise<{ air: OpenMeteoAir; weather: OpenMeteoWeather }> {
  const airUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=european_aqi,us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,dust` +
    `&hourly=pm2_5,pm10,us_aqi,ozone,nitrogen_dioxide,european_aqi&forecast_days=5&past_days=1&timezone=auto`
  const wxUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation` +
    `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&forecast_days=5&timezone=auto`
  const [air, weather] = await Promise.all([
    getJson<OpenMeteoAir>(airUrl),
    getJson<OpenMeteoWeather>(wxUrl),
  ])
  return { air, weather }
}
