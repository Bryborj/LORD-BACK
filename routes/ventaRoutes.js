const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const verificarToken = require('../middleware/authMiddleware');
const { ObjectId } = require('mongodb');

// Registrar una nueva venta
router.post('/', verificarToken, async (req, res) => {
  try {
    const { producto, fecha, cantidad_vendida } = req.body;

    if (!ObjectId.isValid(producto)) {
      return res.status(400).json({ mensaje: 'ID de producto no válido' });
    }

    const nuevaVenta = new Venta({
      producto: new ObjectId(producto),
      fecha: fecha ? new Date(fecha) : new Date(),
      cantidad_vendida
    });

    await nuevaVenta.save();

    res.json({ mensaje: 'Venta registrada correctamente', venta: nuevaVenta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar venta', error });
  }
});

// Obtener ventas de un producto (por ID)
router.get('/producto/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const ventas = await Venta.find({
      producto: new ObjectId(id)
    }).sort({ fecha: 1 });

    res.json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ventas', error });
  }
});

// Obtener todas las ventas (pobladas con datos del producto)
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find().populate('producto');
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
});

// Obtener histórico de ventas por nombre del producto (usando populate)
router.get('/historico/:producto', async (req, res) => {
  try {
    const { producto } = req.params;

    const ventas = await Venta.find()
      .populate('producto')
      .sort({ fecha: 1 });

    const ventasDelProducto = ventas.filter(v => v.producto?.nombre === producto);
    const cantidades = ventasDelProducto.map(v => v.cantidad_vendida);

    res.json(cantidades);
  } catch (err) {
    console.error('Error al obtener ventas históricas:', err);
    res.status(500).json({ error: 'Error al obtener ventas históricas' });
  }
});

module.exports = router;
