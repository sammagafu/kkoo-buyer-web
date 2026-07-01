/** Offline fallback suggestions when geocoding API is unavailable (Dar es Salaam). */
export type DsmPlaceSuggestion = {
  formatted: string
  latitude: number
  longitude: number
  source: 'fallback'
}

export const DSM_PLACE_FALLBACKS: DsmPlaceSuggestion[] = [
  { formatted: 'Kariakoo, Dar es Salaam', latitude: -6.8222, longitude: 39.2694, source: 'fallback' },
  { formatted: 'Ubungo, Dar es Salaam', latitude: -6.7924, longitude: 39.2083, source: 'fallback' },
  { formatted: 'Kinondoni, Dar es Salaam', latitude: -6.7847, longitude: 39.2394, source: 'fallback' },
  { formatted: 'Mlimani City, Dar es Salaam', latitude: -6.7731, longitude: 39.2291, source: 'fallback' },
  { formatted: 'Masaki, Dar es Salaam', latitude: -6.7489, longitude: 39.2696, source: 'fallback' },
  { formatted: 'Oysterbay, Dar es Salaam', latitude: -6.7531, longitude: 39.2742, source: 'fallback' },
  { formatted: 'Sinza, Dar es Salaam', latitude: -6.7788, longitude: 39.2056, source: 'fallback' },
  { formatted: 'Tabata, Dar es Salaam', latitude: -6.8231, longitude: 39.1969, source: 'fallback' },
  { formatted: 'Mbezi, Dar es Salaam', latitude: -6.7208, longitude: 39.2086, source: 'fallback' },
  { formatted: 'Posta, Dar es Salaam', latitude: -6.8161, longitude: 39.2803, source: 'fallback' },
  { formatted: 'Julius Nyerere International Airport', latitude: -6.8781, longitude: 39.2026, source: 'fallback' },
  { formatted: 'Magomeni, Dar es Salaam', latitude: -6.8019, longitude: 39.2547, source: 'fallback' },
  { formatted: 'Temeke, Dar es Salaam', latitude: -6.8547, longitude: 39.2542, source: 'fallback' },
  { formatted: 'Buguruni, Dar es Salaam', latitude: -6.8389, longitude: 39.2431, source: 'fallback' },
  { formatted: 'Mikocheni, Dar es Salaam', latitude: -6.7522, longitude: 39.2419, source: 'fallback' },
]

export function filterDsmPlaceFallbacks(q: string, limit = 8): DsmPlaceSuggestion[] {
  const needle = q.trim().toLowerCase()
  if (needle.length < 2) return []
  return DSM_PLACE_FALLBACKS.filter((p) => p.formatted.toLowerCase().includes(needle)).slice(0, limit)
}
