import { Router } from 'express'
import Category from '../models/Category.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true }
    res.json(await Category.find(filter).sort({ name: 1 }))
  } catch (error) { next(error) }
})

router.post('/', adminAuth, async (req, res, next) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (error) { next(error) }
})

router.patch('/:id', adminAuth, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!category) return res.status(404).json({ message: 'Kategorija nije pronađena.' })
    res.json(category)
  } catch (error) { next(error) }
})

router.delete('/:id', adminAuth, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { active: false }, { new: true })
    if (!category) return res.status(404).json({ message: 'Kategorija nije pronađena.' })
    res.json(category)
  } catch (error) { next(error) }
})

export default router
