const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendToken = (user, res, statusCode = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
  res.status(statusCode).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password });
  sendToken(user, res, 201);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  sendToken(user, res);
};

exports.logout = (req, res) => {
  res.cookie('token', '', { maxAge: 1 });
  res.json({ success: true, message: 'Logged out' });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price images slug');
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  const { name, phone, addresses } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, phone, addresses }, { new: true, runValidators: true });
  res.json({ success: true, user });
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword))) return res.status(400).json({ message: 'Current password incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
};

exports.toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const idx = user.wishlist.indexOf(productId);
  if (idx === -1) user.wishlist.push(productId);
  else user.wishlist.splice(idx, 1);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};
