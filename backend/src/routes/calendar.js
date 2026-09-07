import { Router } from 'express'
import Order from '../models/Order.js'
import Settings from '../models/Settings.js'

const router = Router()

function monthRange(month) {
  const match = /^\d{4}-\d{2}$/.test(month || '') ? month : new Date().toISOString().slice(0, 7)
  const [year, monthNumber] = match.split('-').map(Number)
  const days = new Date(year, monthNumber, 0).getDate()
  return { month: match, start: `${match}-01`, end: `${match}-${String(days).padStart(2, '0')}` }
}

router.get('/', async (req, res, next) => {
  try {
    const { month, start, end } = monthRange(req.query.month)
    const settings = await Settings.findOne()
    const maxOrdersPerDay = settings?.maxOrdersPerDay || 10

    const orders = await Order.find({
      requestedDate: { $gte: start, $lte: end },
      status: { $ne: 'Otkazana' }
    }).sort({ requestedDate: 1, createdAt: 1 })

    const byDate = {}
    for (const order of orders) {
      if (!byDate[order.requestedDate]) byDate[order.requestedDate] = []
      byDate[order.requestedDate].push({
        id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customer?.name || '',
        phone: order.customer?.phone || '',
        total: order.total || 0,
        status: order.status,
        fulfillment: order.fulfillment
      })
    }

    const days = Object.entries(byDate).map(([date, dayOrders]) => ({
      date,
      count: dayOrders.length,
      maxOrdersPerDay,
      available: Math.max(maxOrdersPerDay - dayOrders.length, 0),
      full: dayOrders.length >= maxOrdersPerDay,
      orders: dayOrders
    }))

    res.json({ month, maxOrdersPerDay, days })
  } catch (error) { next(error) }
})

export default router
