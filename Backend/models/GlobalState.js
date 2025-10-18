const mongoose = require('mongoose');

const globalStateSchema = new mongoose.Schema({
  monthlyBudget: {
    type: Number,
    default: 100000
  },
  archivedSpend: {
      type: Number,
      default: 0
  }
});

module.exports = mongoose.model('GlobalState', globalStateSchema);
