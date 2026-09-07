const TOKEN_KEY = 'artkolac_admin_token'

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Prijava nije uspjela.')
  return data
}

export async function loginAdmin(password) {
  const data = await request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) })
  localStorage.setItem(TOKEN_KEY, data.token)
  return data
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken())
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY)
}

export function authHeaders() {
  const token = getAdminToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
