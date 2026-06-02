if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Per-request DB ensure (cached after first connect)
app.use(async (req, res, next) => {
  if (req.path === '/') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ message: 'Database connection failed', detail: err.message });
  }
});

app.get('/', (req, res) => res.json({ status: 'ok', db: !!process.env.MONGO_URI }));

// Register routes synchronously
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 5000, () => console.log('Server on 5000'));
}

module.exports = app;
