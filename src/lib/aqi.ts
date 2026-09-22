export type AqiBand = {
  label: string
  range: string
  color: string
  advice: string
}

export function usAqiBand(aqi: number): AqiBand {
  if (aqi <= 50)
    return { label: 'Good', range: '0–50', color: '#3ee0a3', advice: 'Air quality is satisfactory.' }
  if (aqi <= 100)
    return {
      label: 'Moderate',
      range: '51–100',
      color: '#e8d44d',
      advice: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.',
    }
  if (aqi <= 150)
    return {
      label: 'Unhealthy for sensitive',
      range: '101–150',
      color: '#f4a04a',
      advice: 'Children, elderly, and people with respiratory disease should reduce outdoor activity.',
    }
  if (aqi <= 200)
    return {
      label: 'Unhealthy',
      range: '151–200',
      color: '#ef5b5b',
      advice: 'Everyone may begin to experience health effects. Limit outdoor time.',
    }
  if (aqi <= 300)
    return {
      label: 'Very unhealthy',
      range: '201–300',
      color: '#b56bff',
      advice: 'Health alert: everyone should avoid outdoor exertion.',
    }
  return {
    label: 'Hazardous',
    range: '301+',
    color: '#9b2335',
    advice: 'Emergency conditions. Remain indoors with filtration if possible.',
  }
}

export function aqiColor(aqi: number) {
  return usAqiBand(aqi).color
}
