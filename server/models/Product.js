const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  avatar: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [String],
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  originalBrand: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
  type: { type: String, enum: ['watch', 'bag', 'accessory', 'wallet', 'belt', 'sunglasses'], required: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  images: [{ url: String, alt: String }],
  videos: [String],
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true },
  specifications: [{
    key: String,
    value: String,
  }],
  features: [String],
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  colors: [{ name: String, hex: String }],
  material: String,
  warranty: { type: String, default: '6 months' },
}, { timestamps: true });

productSchema.methods.calcRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.numReviews = 0; return; }
  const total = this.reviews.filter(r => r.isApproved).reduce((acc, r) => acc + r.rating, 0);
  const count = this.reviews.filter(r => r.isApproved).length;
  this.rating = Math.round((total / count) * 10) / 10;
  this.numReviews = count;
};

module.exports = mongoose.model('Product', productSchema);
