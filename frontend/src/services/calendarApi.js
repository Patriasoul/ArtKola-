import { authHeaders } from './adminAuth'

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Zahtjev nije uspio.')
  return data
}

export const getCalendar = (month) => request(`/api/calendar?month=${encodeURIComponent(month)}`)
export const getSettings = () => request('/api/settings')
export const updateSettings = (settings) => request('/api/settings', {
  method: 'PUT',
  headers: authHeaders(),
  body: JSON.stringify(settings)
})
