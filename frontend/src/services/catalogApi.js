async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Zahtjev nije uspio.')
  return data
}

export const getProducts = (all = false) => request(`/api/products${all ? '?all=true' : ''}`)
export const createProduct = (product) => request('/api/products', { method: 'POST', body: JSON.stringify(product) })
export const updateProduct = (id, product) => request(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(product) })
export const deleteProduct = (id) => request(`/api/products/${id}`, { method: 'DELETE' })

export const getCategories = (all = false) => request(`/api/categories${all ? '?all=true' : ''}`)
export const createCategory = (category) => request('/api/categories', { method: 'POST', body: JSON.stringify(category) })
export const updateCategory = (id, category) => request(`/api/categories/${id}`, { method: 'PATCH', body: JSON.stringify(category) })
export const deleteCategory = (id) => request(`/api/categories/${id}`, { method: 'DELETE' })
