import { Router } from 'express'
import CustomOrder from '../models/CustomOrder.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()
const statuses = ['Zaprimljen', 'U obradi', 'Ponuda poslana', 'Potvrđen', 'Odbijen', 'Završen']

router.get('/', adminAuth, async (_req, res, next) => {
  try { res.json(await CustomOrder.find().sort({ createdAt: -1 }).limit(100)) } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, people, flavor, decoration = '', cakeText = '', desiredDate, note = '', referenceImageUrl = '' } = req.body
    if (!name || !email || !phone || !people || !flavor || !desiredDate) return res.status(400).json({ message: 'Nedostaju obavezni podaci upita.' })
    const customOrder = await CustomOrder.create({ customer: { name, email, phone }, people, flavor, decoration, cakeText, desiredDate, note, referenceImageUrl })
    res.status(201).json({ message: 'Upit za tortu po želji je zaprimljen.', id: customOrder._id, status: customOrder.status })
  } catch (error) { next(error) }
})

router.patch('/:id', adminAuth, async (req, res, next) => {
  try {
    const update = {}
    if (req.body.status && statuses.includes(req.body.status)) update.status = req.body.status
    if (req.body.proposedPrice !== undefined) update.proposedPrice = req.body.proposedPrice === null ? null : Number(req.body.proposedPrice)
    if (req.body.adminNote !== undefined) update.adminNote = req.body.adminNote
    const item = await CustomOrder.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!item) return res.status(404).json({ message: 'Upit nije pronađen.' })
    res.json(item)
  } catch (error) { next(error) }
})

export default router
