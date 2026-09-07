import { Router } from 'express'
import { createAdminToken, verifyAdminCredentials } from '../middleware/adminAuth.js'

const router = Router()

router.post('/login', (req, res) => {
  const password = req.body?.password || ''
  if (!verifyAdminCredentials(password)) return res.status(401).json({ message: 'Pogrešna administratorska lozinka.' })
  try {
    res.json({ token: createAdminToken(), expiresIn: 12 * 60 * 60 })
  } catch (error) {
    res.status(503).json({ message: error.message })
  }
})

export default router
