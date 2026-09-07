import { authHeaders } from './adminAuth'

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Zahtjev nije uspio.')
  return data
}

export const getProducts = (all = false) => request(`/api/products${all ? '?all=true' : ''}`, { headers: all ? authHeaders() : {} })
export const createProduct = (product) => request('/api/products', { method: 'POST', headers: authHeaders(), body: JSON.stringify(product) })
export const updateProduct = (id, product) => request(`/api/products/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(product) })
export const deleteProduct = (id) => request(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders() })

export const getCategories = (all = false) => request(`/api/categories${all ? '?all=true' : ''}`, { headers: all ? authHeaders() : {} })
export const createCategory = (category) => request('/api/categories', { method: 'POST', headers: authHeaders(), body: JSON.stringify(category) })
export const updateCategory = (id, category) => request(`/api/categories/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(category) })
export const deleteCategory = (id) => request(`/api/categories/${id}`, { method: 'DELETE', headers: authHeaders() })
