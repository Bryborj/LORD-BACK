const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  cantidad_vendida: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Venta', ventaSchema);
