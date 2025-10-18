const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  // Add a transform to rename _id to id when converting to JSON
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
