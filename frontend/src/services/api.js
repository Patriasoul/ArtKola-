import { authHeaders } from './adminAuth'

async function request(url, options = {}) {
  const response = await fetch(url, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Zahtjev nije uspio.')
  return data
}

export function createOrder(order) {
  return request('/api/orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order)
  })
}

export function getOrders() { return request('/api/orders', { headers: authHeaders() }) }

export function updateOrderStatus(id, status) {
  return request(`/api/orders/${id}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ status })
  })
}

export function createCustomOrder(order) {
  return request('/api/custom-orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order)
  })
}

export function getSettings() { return request('/api/settings') }

export function saveSettings(settings) {
  return request('/api/settings', {
    method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(settings)
  })
}
