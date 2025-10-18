const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
import Expense from './models/Expense.js';
import UserCategory from './models/UserCategory.js';
import Budget from './models/Budget.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', require('./routes/data'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('ExpenseWise Backend is running!');
});

app.get('/all-data', async (req, res) => {
  try {
    const expenses = await Expense.find();        // Get all expenses
    const categories = await UserCategory.find(); // Get all categories
    const budgets = await Budget.find();          // Get all budgets

    res.json({
      expenses,
      categories,
      budgets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});
