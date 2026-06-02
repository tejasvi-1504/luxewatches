const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'India' },
  },
  paymentMethod: { type: String, enum: ['cod', 'online', 'upi'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentId: String,
  itemsPrice: Number,
  shippingPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  totalPrice: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refund_requested', 'refunded'],
    default: 'pending'
  },
  trackingNumber: String,
  trackingUrl: String,
  statusHistory: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  }],
  refundReason: String,
  refundStatus: { type: String, enum: ['none', 'requested', 'approved', 'rejected', 'processed'], default: 'none' },
  refundAmount: Number,
  deliveredAt: Date,
  notes: String,
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'LW' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
