const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
  const order = await Order.create({ user: req.user._id, items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, statusHistory: [{ status: 'pending', message: 'Order placed successfully' }] });
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, soldCount: item.quantity } });
  }
  res.status(201).json({ success: true, order });
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product', 'name images slug');
  res.json({ success: true, orders });
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name images slug');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json({ success: true, order });
};

exports.requestRefund = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
  if (!['delivered'].includes(order.status)) return res.status(400).json({ message: 'Refund only for delivered orders' });
  order.refundStatus = 'requested';
  order.refundReason = req.body.reason;
  order.status = 'refund_requested';
  order.statusHistory.push({ status: 'refund_requested', message: `Refund requested: ${req.body.reason}` });
  await order.save();
  res.json({ success: true, message: 'Refund request submitted' });
};

// Admin
exports.getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);
  res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
};

exports.updateOrderStatus = async (req, res) => {
  const { status, message, trackingNumber, trackingUrl } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (trackingUrl) order.trackingUrl = trackingUrl;
  if (status === 'delivered') { order.deliveredAt = new Date(); order.paymentStatus = 'paid'; }
  order.statusHistory.push({ status, message: message || `Order ${status}` });
  await order.save();
  res.json({ success: true, order });
};

exports.handleRefund = async (req, res) => {
  const { action, amount } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (action === 'approve') {
    order.refundStatus = 'approved';
    order.refundAmount = amount || order.totalPrice;
    order.status = 'refunded';
    order.paymentStatus = 'refunded';
    order.statusHistory.push({ status: 'refunded', message: 'Refund approved and processed' });
  } else {
    order.refundStatus = 'rejected';
    order.status = 'delivered';
    order.statusHistory.push({ status: 'delivered', message: 'Refund request rejected' });
  }
  await order.save();
  res.json({ success: true, order });
};

exports.getStats = async (req, res) => {
  const [totalOrders, totalRevenue, pendingOrders, deliveredOrders] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'delivered' }),
  ]);
  const revenueByMonth = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
    { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  res.json({ success: true, stats: { totalOrders, totalRevenue: totalRevenue[0]?.total || 0, pendingOrders, deliveredOrders, revenueByMonth } });
};
