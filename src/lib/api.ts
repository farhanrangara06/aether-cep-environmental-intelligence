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
  latitude?: number
  longitude?: number
  current?: CurrentAir
  hourly?: HourlySeries
}

type OpenMeteoWeather = {
  latitude?: number
  longitude?: number
  current?: CurrentWeather
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Request failed ${res.status}`)
  return res.json() as Promise<T>
}

function latestHourlyAir(hourly?: HourlySeries | null): CurrentAir | null {
  if (!hourly?.time?.length) return null
  const now = Date.now()
  let idx = hourly.time.findIndex((t) => new Date(t).getTime() > now) - 1
  if (idx < 0) idx = hourly.time.length - 1
  const n = (arr?: number[]) => arr?.[idx] ?? Number.NaN
  return {
    time: hourly.time[idx],
    european_aqi: Number.NaN,
    us_aqi: n(hourly.us_aqi),
    pm2_5: n(hourly.pm2_5),
    pm10: n(hourly.pm10),
    carbon_monoxide: Number.NaN,
    nitrogen_dioxide: n(hourly.nitrogen_dioxide),
    sulphur_dioxide: Number.NaN,
    ozone: n(hourly.ozone),
    uv_index: Number.NaN,
    dust: Number.NaN,
  }
}

function fresherAir(current?: CurrentAir | null, hourly?: HourlySeries | null): CurrentAir | null {
  const fromHour = latestHourlyAir(hourly)
  if (!current) return fromHour
  if (!fromHour) return current
  if (new Date(fromHour.time).getTime() < new Date(current.time).getTime()) return current
  return {
    ...current,
    time: fromHour.time,
    us_aqi: fromHour.us_aqi,
    pm2_5: fromHour.pm2_5,
    pm10: fromHour.pm10,
    ozone: fromHour.ozone,
    nitrogen_dioxide: fromHour.nitrogen_dioxide,
  }
}

async function loadOne(city: City): Promise<CitySnapshot> {
  const airUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=european_aqi,us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,dust` +
    `&hourly=pm2_5,pm10,us_aqi,ozone,nitrogen_dioxide&forecast_days=2&past_days=1&timezone=auto`
  const wxUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation` +
    `&forecast_days=1&timezone=auto`

  const [air, weather] = await Promise.all([
    getJson<OpenMeteoAir>(airUrl),
    getJson<OpenMeteoWeather>(wxUrl),
  ])

  return {
    city,
    air: fresherAir(air.current ?? null, air.hourly ?? null),
    weather: weather.current ?? null,
    hourly: air.hourly ?? null,
  }
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      out[index] = await fn(items[index])
    }
  })
  await Promise.all(workers)
  return out
}

export async function loadWorldGrid(): Promise<CitySnapshot[]> {
  const rows = await pool(CITIES, 8, async (city) => {
    try {
      return await loadOne(city)
    } catch {
      return { city, air: null, weather: null, hourly: null }
    }
  })
  return rows
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
