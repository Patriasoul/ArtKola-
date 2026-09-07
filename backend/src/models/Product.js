import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  people: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  options: { type: [String], default: [] },
  active: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
