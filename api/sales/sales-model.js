const mongoose = require('mongoose');

const SalesSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  parentName: String,
  parentType: String,
  sales: String,
  month: String,
  color: String,
  order: Number
});

const Sales = mongoose.model('Sales', SalesSchema);

module.exports = Sales;
