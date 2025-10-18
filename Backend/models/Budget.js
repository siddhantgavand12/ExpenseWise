const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Budget', budgetSchema);
