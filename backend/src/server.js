import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ArtKolač API' })
})

app.get('/api/delivery-zones', (_req, res) => {
  res.json([
    { label: 'Do 5 km', price: 3 },
    { label: '5–10 km', price: 5 },
    { label: '10–20 km', price: 8 },
    { label: '20–30 km', price: 12 },
    { label: '30–40 km', price: 15 },
    { label: '40–50 km', price: 20 },
    { label: 'Preko 50 km', price: null, note: 'Po dogovoru' }
  ])
})

app.post('/api/orders', async (req, res) => {
  const { name, email, phone, fulfillment, date } = req.body
  if (!name || !email || !phone || !fulfillment || !date) {
    return res.status(400).json({ message: 'Nedostaju obavezni podaci narudžbe.' })
  }
  // Database persistence is added in the next backend step.
  return res.status(201).json({
    message: 'Narudžba je zaprimljena i čeka ručnu potvrdu.',
    orderNumber: `AK-${Date.now().toString().slice(-8)}`,
    status: 'Zaprimljena'
  })
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
