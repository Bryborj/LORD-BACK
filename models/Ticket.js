const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productos: [
    {
      nombre: String,
      precio: Number,
      cantidad: Number
    }
  ],
  total: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ticket", TicketSchema);
