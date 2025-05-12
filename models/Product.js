const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String },
  precio: { 
    type: Number, 
    required: true, 
    set: v => parseFloat(parseFloat(v).toFixed(2)) 

  },
  stock_actual: { type: Number, required: true },
  unidad_medida: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
