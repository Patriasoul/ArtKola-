import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true }
    res.json(await Product.find(filter).sort({ category: 1, name: 1 }))
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) { next(error) }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ message: 'Proizvod nije pronađen.' })
    res.json(product)
  } catch (error) { next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true })
    if (!product) return res.status(404).json({ message: 'Proizvod nije pronađen.' })
    res.json(product)
  } catch (error) { next(error) }
})

export default router
