if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health check — no DB needed
app.get('/', (req, res) => {
  res.json({
    status: 'LuxeWatches API running ✓',
    db: !!process.env.MONGO_URI,
    env: process.env.NODE_ENV,
  });
});

// Connect DB then mount routes
connectDB()
  .then(() => {
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/products', require('./routes/productRoutes'));
    app.use('/api/orders', require('./routes/orderRoutes'));
    app.use('/api/categories', require('./routes/categoryRoutes'));

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({ message: err.message || 'Server error' });
    });
  })
  .catch(err => {
    console.error('DB connection failed:', err.message);
    app.use('/api', (req, res) => {
      res.status(503).json({ message: 'Database unavailable', error: err.message });
    });
  });

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
