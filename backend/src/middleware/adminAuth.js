import crypto from 'node:crypto'

const TOKEN_TTL_SECONDS = 12 * 60 * 60

function secret() {
  return process.env.ADMIN_SECRET || ''
}

function password() {
  return process.env.ADMIN_PASSWORD || ''
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url')
}

export function createAdminToken() {
  if (!secret() || !password()) throw new Error('ADMIN_PASSWORD i ADMIN_SECRET moraju biti postavljeni.')
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifyAdminCredentials(value) {
  return Boolean(password() && secret() && safeEqual(value, password()))
}

export function adminAuth(req, res, next) {
  if (!secret()) return res.status(503).json({ message: 'Administracija nije konfigurirana. Postavi ADMIN_SECRET.' })
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const [payload, signature] = token.split('.')
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return res.status(401).json({ message: 'Niste prijavljeni kao administrator.' })

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (data.role !== 'admin' || !data.exp || data.exp < Math.floor(Date.now() / 1000)) return res.status(401).json({ message: 'Admin sesija je istekla.' })
    req.admin = data
    next()
  } catch {
    return res.status(401).json({ message: 'Neispravna admin sesija.' })
  }
}
