import mongoose from 'mongoose'

const deliveryZoneSchema = new mongoose.Schema({
  label: { type: String, required: true },
  maxKm: { type: Number, default: null },
  price: { type: Number, default: null },
  note: { type: String, default: '' }
}, { _id: false })

const settingsSchema = new mongoose.Schema({
  maxOrdersPerDay: { type: Number, default: 10, min: 1 },
  deliveryZones: { type: [deliveryZoneSchema], default: [] },
  businessName: { type: String, default: 'ArtKolač' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('Settings', settingsSchema)
