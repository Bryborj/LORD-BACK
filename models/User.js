const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: { type: String, enum: ["admin", "empleado"], default: "empleado"}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);