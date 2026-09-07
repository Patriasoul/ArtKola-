import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import adminAuthRouter from './routes/adminAuth.js'
import ordersRouter from './routes/orders.js'
import customOrdersRouter from './routes/customOrders.js'
import settingsRouter from './routes/settings.js'
import productsRouter from './routes/products.js'
import categoriesRouter from './routes/categories.js'
import calendarRouter from './routes/calendar.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'ArtKolač API' }))
app.use('/api/admin', adminAuthRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/custom-orders', customOrdersRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/calendar', calendarRouter)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Došlo je do greške na poslužitelju.' })
})

async function start() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')
  } else {
    console.log('MONGODB_URI nije postavljen – API radi bez baze.')
  }
  app.listen(PORT, () => console.log(`ArtKolač API radi na portu ${PORT}`))
}

start().catch((error) => {
  console.error('Pokretanje API-ja nije uspjelo:', error)
  process.exit(1)
})
