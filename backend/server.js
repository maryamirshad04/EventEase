require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const invitationRoutes = require('./routes/invitationRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://doppleganger-xi.vercel.app',  // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Explicitly handle preflight for all routes
app.options('*', cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/invitations', invitationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
