import mongoose from 'mongoose'

const customOrderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true }
  },
  people: { type: Number, required: true, min: 1 },
  flavor: { type: String, required: true, trim: true },
  decoration: { type: String, default: '' },
  cakeText: { type: String, default: '' },
  desiredDate: { type: String, required: true },
  note: { type: String, default: '' },
  referenceImageUrl: { type: String, default: '' },
  proposedPrice: { type: Number, default: null, min: 0 },
  status: { type: String, enum: ['Zaprimljen', 'U obradi', 'Ponuda poslana', 'Potvrđen', 'Odbijen', 'Završen'], default: 'Zaprimljen' },
  adminNote: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('CustomOrder', customOrderSchema)
