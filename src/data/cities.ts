export type City = {
  id: string
  name: string
  country: string
  region: string
  lat: number
  lon: number
  populationM: number
}

/** Major population + monitoring hubs used as the global sensor grid. */
export const CITIES: City[] = [
  { id: 'del', name: 'New Delhi', country: 'India', region: 'South Asia', lat: 28.6139, lon: 77.209, populationM: 32 },
  { id: 'mum', name: 'Mumbai', country: 'India', region: 'South Asia', lat: 19.076, lon: 72.8777, populationM: 21 },
  { id: 'kol', name: 'Kolkata', country: 'India', region: 'South Asia', lat: 22.5726, lon: 88.3639, populationM: 15 },
  { id: 'blr', name: 'Bengaluru', country: 'India', region: 'South Asia', lat: 12.9716, lon: 77.5946, populationM: 13 },
  { id: 'chn', name: 'Chennai', country: 'India', region: 'South Asia', lat: 13.0827, lon: 80.2707, populationM: 11 },
  { id: 'lah', name: 'Lahore', country: 'Pakistan', region: 'South Asia', lat: 31.5204, lon: 74.3587, populationM: 13 },
  { id: 'dha', name: 'Dhaka', country: 'Bangladesh', region: 'South Asia', lat: 23.8103, lon: 90.4125, populationM: 22 },
  { id: 'kath', name: 'Kathmandu', country: 'Nepal', region: 'South Asia', lat: 27.7172, lon: 85.324, populationM: 1.5 },
  { id: 'bkk', name: 'Bangkok', country: 'Thailand', region: 'SE Asia', lat: 13.7563, lon: 100.5018, populationM: 11 },
  { id: 'jkt', name: 'Jakarta', country: 'Indonesia', region: 'SE Asia', lat: -6.2088, lon: 106.8456, populationM: 11 },
  { id: 'sgp', name: 'Singapore', country: 'Singapore', region: 'SE Asia', lat: 1.3521, lon: 103.8198, populationM: 5.9 },
  { id: 'hkg', name: 'Hong Kong', country: 'China', region: 'East Asia', lat: 22.3193, lon: 114.1694, populationM: 7.5 },
  { id: 'bej', name: 'Beijing', country: 'China', region: 'East Asia', lat: 39.9042, lon: 116.4074, populationM: 21 },
  { id: 'sha', name: 'Shanghai', country: 'China', region: 'East Asia', lat: 31.2304, lon: 121.4737, populationM: 26 },
  { id: 'seo', name: 'Seoul', country: 'South Korea', region: 'East Asia', lat: 37.5665, lon: 126.978, populationM: 9.7 },
  { id: 'tyo', name: 'Tokyo', country: 'Japan', region: 'East Asia', lat: 35.6762, lon: 139.6503, populationM: 37 },
  { id: 'syd', name: 'Sydney', country: 'Australia', region: 'Oceania', lat: -33.8688, lon: 151.2093, populationM: 5.3 },
  { id: 'mel', name: 'Melbourne', country: 'Australia', region: 'Oceania', lat: -37.8136, lon: 144.9631, populationM: 5.1 },
  { id: 'akl', name: 'Auckland', country: 'New Zealand', region: 'Oceania', lat: -36.8509, lon: 174.7645, populationM: 1.7 },
  { id: 'dxb', name: 'Dubai', country: 'UAE', region: 'Middle East', lat: 25.2048, lon: 55.2708, populationM: 3.5 },
  { id: 'ruh', name: 'Riyadh', country: 'Saudi Arabia', region: 'Middle East', lat: 24.7136, lon: 46.6753, populationM: 7.6 },
  { id: 'teh', name: 'Tehran', country: 'Iran', region: 'Middle East', lat: 35.6892, lon: 51.389, populationM: 9.4 },
  { id: 'cai', name: 'Cairo', country: 'Egypt', region: 'Africa', lat: 30.0444, lon: 31.2357, populationM: 22 },
  { id: 'lag', name: 'Lagos', country: 'Nigeria', region: 'Africa', lat: 6.5244, lon: 3.3792, populationM: 21 },
  { id: 'nbo', name: 'Nairobi', country: 'Kenya', region: 'Africa', lat: -1.2921, lon: 36.8219, populationM: 5.1 },
  { id: 'jnb', name: 'Johannesburg', country: 'South Africa', region: 'Africa', lat: -26.2041, lon: 28.0473, populationM: 5.6 },
  { id: 'cpt', name: 'Cape Town', country: 'South Africa', region: 'Africa', lat: -33.9249, lon: 18.4241, populationM: 4.6 },
  { id: 'lon', name: 'London', country: 'United Kingdom', region: 'Europe', lat: 51.5074, lon: -0.1278, populationM: 9.5 },
  { id: 'par', name: 'Paris', country: 'France', region: 'Europe', lat: 48.8566, lon: 2.3522, populationM: 11 },
  { id: 'ber', name: 'Berlin', country: 'Germany', region: 'Europe', lat: 52.52, lon: 13.405, populationM: 3.7 },
  { id: 'ams', name: 'Amsterdam', country: 'Netherlands', region: 'Europe', lat: 52.3676, lon: 4.9041, populationM: 1.2 },
  { id: 'mad', name: 'Madrid', country: 'Spain', region: 'Europe', lat: 40.4168, lon: -3.7038, populationM: 6.7 },
  { id: 'rom', name: 'Rome', country: 'Italy', region: 'Europe', lat: 41.9028, lon: 12.4964, populationM: 4.3 },
  { id: 'ist', name: 'Istanbul', country: 'Türkiye', region: 'Europe', lat: 41.0082, lon: 28.9784, populationM: 15 },
  { id: 'waw', name: 'Warsaw', country: 'Poland', region: 'Europe', lat: 52.2297, lon: 21.0122, populationM: 1.8 },
  { id: 'mos', name: 'Moscow', country: 'Russia', region: 'Europe', lat: 55.7558, lon: 37.6173, populationM: 13 },
  { id: 'sto', name: 'Stockholm', country: 'Sweden', region: 'Europe', lat: 59.3293, lon: 18.0686, populationM: 1.6 },
  { id: 'osl', name: 'Oslo', country: 'Norway', region: 'Europe', lat: 59.9139, lon: 10.7522, populationM: 0.7 },
  { id: 'nyc', name: 'New York', country: 'United States', region: 'North America', lat: 40.7128, lon: -74.006, populationM: 19 },
  { id: 'lax', name: 'Los Angeles', country: 'United States', region: 'North America', lat: 34.0522, lon: -118.2437, populationM: 13 },
  { id: 'chi', name: 'Chicago', country: 'United States', region: 'North America', lat: 41.8781, lon: -87.6298, populationM: 8.9 },
  { id: 'sfo', name: 'San Francisco', country: 'United States', region: 'North America', lat: 37.7749, lon: -122.4194, populationM: 4.7 },
  { id: 'mex', name: 'Mexico City', country: 'Mexico', region: 'North America', lat: 19.4326, lon: -99.1332, populationM: 22 },
  { id: 'tor', name: 'Toronto', country: 'Canada', region: 'North America', lat: 43.6532, lon: -79.3832, populationM: 6.3 },
  { id: 'van', name: 'Vancouver', country: 'Canada', region: 'North America', lat: 49.2827, lon: -123.1207, populationM: 2.6 },
  { id: 'sao', name: 'São Paulo', country: 'Brazil', region: 'South America', lat: -23.5558, lon: -46.6396, populationM: 22 },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', region: 'South America', lat: -22.9068, lon: -43.1729, populationM: 13 },
  { id: 'bog', name: 'Bogotá', country: 'Colombia', region: 'South America', lat: 4.711, lon: -74.0721, populationM: 11 },
  { id: 'lim', name: 'Lima', country: 'Peru', region: 'South America', lat: -12.0464, lon: -77.0428, populationM: 11 },
  { id: 'bue', name: 'Buenos Aires', country: 'Argentina', region: 'South America', lat: -34.6037, lon: -58.3816, populationM: 15 },
  { id: 'scl', name: 'Santiago', country: 'Chile', region: 'South America', lat: -33.4489, lon: -70.6693, populationM: 6.8 },
]
