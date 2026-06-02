const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
  const { gender, type, category, minPrice, maxPrice, sort, search, featured, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (gender) filter.gender = gender;
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { brand: { $regex: search, $options: 'i' } },
    { tags: { $in: [new RegExp(search, 'i')] } },
  ];
  const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, newest: { createdAt: -1 }, rating: { rating: -1 }, popular: { soldCount: -1 } };
  const sortOption = sortMap[sort] || { createdAt: -1 };
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sortOption).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, products, total, pages: Math.ceil(total / limit), page: Number(page) });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug gender');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ success: true, product });
};

exports.getFeatured = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8).populate('category', 'name');
  res.json({ success: true, products });
};

exports.getRelated = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const products = await Product.find({ category: product.category, _id: { $ne: product._id }, isActive: true }).limit(6);
  res.json({ success: true, products });
};

exports.addReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (already) return res.status(400).json({ message: 'Already reviewed' });
  product.reviews.push({ user: req.user._id, name: req.user.name, avatar: req.user.avatar, rating: req.body.rating, comment: req.body.comment });
  product.calcRating();
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
};

// Admin
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ success: true, product });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  res.json({ success: true, message: 'Product removed' });
};

exports.adminGetProducts = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, products, total, pages: Math.ceil(total / limit) });
};

exports.manageReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  const { action } = req.body;
  const product = await Product.findById(productId);
  const review = product.reviews.id(reviewId);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (action === 'approve') review.isApproved = true;
  if (action === 'reject') review.isApproved = false;
  if (action === 'delete') product.reviews.pull(reviewId);
  product.calcRating();
  await product.save();
  res.json({ success: true, message: 'Review updated' });
};
