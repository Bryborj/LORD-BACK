const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  try {
    const { productos, total } = req.body;
    const nuevoTicket = new Ticket({
      usuario: req.user.id,
      productos,
      total
    });
    const saved = await nuevoTicket.save();
    res.json(saved);
  } catch (err) {
    console.error("Error al guardar ticket:", err);
    res.status(500).send("Error del servidor");
  }
});

// Obtener todos los tickets
router.get("/", async (req, res) => {
    try {
      const tickets = await Ticket.find().populate("usuario", "nombre correo");
      res.json(tickets);
    } catch (error) {
      console.error("Error al obtener tickets:", error);
      res.status(500).json({ error: "Error al obtener los tickets" });
    }
  });

// Ruta GET /api/ventas
router.get('/ventas', async (req, res) => {
    try {
      const ventas = await Venta.find().populate('producto');
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ventas' });
    }
  });

module.exports = router;
