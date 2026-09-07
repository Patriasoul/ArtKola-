import { Router } from 'express'
import Settings from '../models/Settings.js'

const router = Router()

const defaultZones = [
  { label: 'Do 5 km', maxKm: 5, price: 3 },
  { label: '5–10 km', maxKm: 10, price: 5 },
  { label: '10–20 km', maxKm: 20, price: 8 },
  { label: '20–30 km', maxKm: 30, price: 12 },
  { label: '30–40 km', maxKm: 40, price: 15 },
  { label: '40–50 km', maxKm: 50, price: 20 },
  { label: 'Preko 50 km', maxKm: null, price: null, note: 'Po dogovoru' }
]

router.get('/', async (_req, res, next) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) settings = await Settings.create({ deliveryZones: defaultZones })
    res.json(settings)
  } catch (error) { next(error) }
})

router.put('/', async (req, res, next) => {
  try {
    const update = {
      maxOrdersPerDay: Number(req.body.maxOrdersPerDay) || 10,
      deliveryZones: Array.isArray(req.body.deliveryZones) ? req.body.deliveryZones : defaultZones,
      businessName: req.body.businessName ?? 'ArtKolač',
      contactEmail: req.body.contactEmail ?? '',
      contactPhone: req.body.contactPhone ?? ''
    }
    const settings = await Settings.findOneAndUpdate({}, update, { new: true, upsert: true, setDefaultsOnInsert: true })
    res.json(settings)
  } catch (error) { next(error) }
})

export { defaultZones }
export default router
