import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  customer: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true }
  },
  fulfillment: { type: String, enum: ['pickup', 'delivery'], required: true },
  deliveryZone: { type: String, default: '' },
  deliveryFee: { type: Number, default: 0, min: 0 },
  address: { type: String, default: '' },
  date: { type: String, required: true },
  note: { type: String, default: '' },
  items: { type: [orderItemSchema], default: [] },
  subtotal: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['cash_on_delivery'], default: 'cash_on_delivery' },
  status: {
    type: String,
    enum: ['Zaprimljena', 'Potvrđena', 'U izradi', 'Spremna', 'Isporučena', 'Završena', 'Otkazana'],
    default: 'Zaprimljena',
    index: true
  },
  adminNote: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
