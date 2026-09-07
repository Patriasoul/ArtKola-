import { Router } from 'express'
import Order from '../models/Order.js'

const router = Router()
const deliveryZones = [
  { label: 'Do 5 km', price: 3 }, { label: '5–10 km', price: 5 }, { label: '10–20 km', price: 8 },
  { label: '20–30 km', price: 12 }, { label: '30–40 km', price: 15 }, { label: '40–50 km', price: 20 },
  { label: 'Preko 50 km', price: null, note: 'Po dogovoru' }
]
const statuses = ['Zaprimljena', 'Potvrđena', 'U izradi', 'Spremna', 'Isporučena', 'Završena', 'Otkazana']

router.get('/', async (_req, res, next) => {
  try { res.json(await Order.find().sort({ createdAt: -1 }).limit(100)) } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, fulfillment, deliveryZone = '', address = '', date, note = '', items = [] } = req.body
    if (!name || !email || !phone || !fulfillment || !date) return res.status(400).json({ message: 'Nedostaju obavezni podaci narudžbe.' })
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Košarica je prazna.' })
    if (!['pickup', 'delivery'].includes(fulfillment)) return res.status(400).json({ message: 'Način preuzimanja nije valjan.' })

    let deliveryFee = 0
    if (fulfillment === 'delivery') {
      if (!address.trim()) return res.status(400).json({ message: 'Adresa za dostavu je obavezna.' })
      const zone = deliveryZones.find((item) => item.label === deliveryZone)
      if (!zone) return res.status(400).json({ message: 'Odaberite zonu dostave.' })
      if (zone.price == null) return res.status(400).json({ message: 'Dostava preko 50 km dogovara se pojedinačno.' })
      deliveryFee = zone.price
    }

    const safeItems = items.map((item) => ({ productId: String(item.id), name: String(item.name), price: Number(item.price), quantity: Number(item.quantity) }))
    const subtotal = safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal + deliveryFee
    const order = await Order.create({ orderNumber: `AK-${Date.now().toString().slice(-8)}`, customer: { name, email, phone }, fulfillment, deliveryZone, deliveryFee, address, date, note, items: safeItems, subtotal, total, paymentMethod: 'cash_on_delivery', status: 'Zaprimljena' })
    res.status(201).json({ message: 'Narudžba je zaprimljena i čeka ručnu potvrdu.', orderNumber: order.orderNumber, status: order.status, total: order.total })
  } catch (error) { next(error) }
})

router.patch('/:id/status', async (req, res, next) => {
  try {
    if (!statuses.includes(req.body.status)) return res.status(400).json({ message: 'Neispravan status.' })
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Narudžba nije pronađena.' })
    res.json(order)
  } catch (error) { next(error) }
})

export default router
