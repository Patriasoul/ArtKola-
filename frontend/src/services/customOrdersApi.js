async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Zahtjev nije uspio.')
  return data
}

export const createCustomOrder = (order) => request('/api/custom-orders', { method: 'POST', body: JSON.stringify(order) })
export const getCustomOrders = () => request('/api/custom-orders')
export const updateCustomOrder = (id, data) => request(`/api/custom-orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
