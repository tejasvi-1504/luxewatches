const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const { gender } = req.query;
  const filter = { isActive: true };
  if (gender) filter.gender = gender;
  const categories = await Category.find(filter).sort({ name: 1 });
  res.json({ success: true, categories });
};

exports.createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, category });
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Category removed' });
};
