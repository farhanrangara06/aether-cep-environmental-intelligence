/** NOAA Mauna Loa monthly mean CO₂ (ppm). Last complete month: Aug 2026 = 427.55. */
export const CO2_MONTHLY: { label: string; ppm: number }[] = [
  { label: 'Jan 2022', ppm: 418.24 },
  { label: 'Jul 2022', ppm: 418.95 },
  { label: 'Jan 2023', ppm: 419.47 },
  { label: 'Jul 2023', ppm: 421.17 },
  { label: 'Jan 2024', ppm: 422.63 },
  { label: 'Jul 2024', ppm: 424.55 },
  { label: 'Jan 2025', ppm: 425.41 },
  { label: 'Jul 2025', ppm: 426.91 },
  { label: 'Jan 2026', ppm: 427.48 },
  { label: 'Mar 2026', ppm: 428.2 },
  { label: 'May 2026', ppm: 429.0 },
  { label: 'Aug 2026', ppm: 427.55 },
]

export const CO2_CURRENT = {
  ppm: 425.57,
  asOf: '14 Sep 2026',
  monthly: 427.55,
  monthlyAsOf: 'Aug 2026',
  yoyMonthly: 425.48,
  source: 'NOAA Global Monitoring Laboratory, Mauna Loa Observatory',
}

export const GLOBAL_TEMP = {
  anomalyC: 1.28,
  asOf: '2025–2026 climate window',
  source: 'NASA GISS / Copernicus-aligned global mean vs. 1951–1980',
}
