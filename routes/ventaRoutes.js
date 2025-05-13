const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Producto = require('../models/Product');
const verificarToken = require('../middleware/authMiddleware');
const { ObjectId } = require('mongodb');

// Registrar varias ventas desde el carrito
router.post('/carrito', verificarToken, async (req, res) => {
  try {
    const { ventas } = req.body;

    if (!Array.isArray(ventas) || ventas.length === 0) {
      return res.status(400).json({ mensaje: 'Lista de ventas vacía o inválida' });
    }

    // Validar stock antes de registrar
    for (const item of ventas) {
      if (!ObjectId.isValid(item.producto)) {
        return res.status(400).json({ mensaje: 'ID de producto no válido' });
      }

      const producto = await Producto.findById(item.producto);
      if (!producto) {
        return res.status(404).json({ mensaje: `Producto con ID ${item.producto} no encontrado` });
      }

      if (producto.stock_actual < item.cantidad_vendida) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para ${producto.nombre}. Solo hay ${producto.stock_actual} disponibles.`,
        });
      }
    }

    // Si todos tienen stock, registrar ventas y actualizar inventario
    const nuevasVentas = [];

    for (const item of ventas) {
      const nuevaVenta = new Venta({
        producto: new ObjectId(item.producto),
        cantidad_vendida: item.cantidad_vendida,
        fecha: item.fecha ? new Date(item.fecha) : new Date(),
      });

      await nuevaVenta.save();
      nuevasVentas.push(nuevaVenta);

      const producto = await Producto.findById(item.producto);
      producto.stock_actual -= item.cantidad_vendida;
      await producto.save();
    }

    res.json({ mensaje: 'Ventas registradas correctamente', ventas: nuevasVentas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar ventas del carrito', error });
  }
});


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

    //Actualizar el stock del producto
    const productDB = await Producto.findById(producto);

    if (!productDB) {
      return res.status(404).json({mensaje: 'Producto no encontrado'});
    }

    if (productDB.stock_actual < cantidad_vendida) {
      return res.status(400).json({ mensaje: 'Stock insuficiente' });
    }

    productDB.stock_actual -= cantidad_vendida;
    await productDB.save();

    res.json({ mensaje: 'Venta registrada correctamente', venta: nuevaVenta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar venta', error });
  }
});

router.post('/carrito', verificarToken, async (req, res) => {
  const session = await Venta.startSession();
  session.startTransaction();
  try {
    const { ventas } = req.body; // lista de ventas

    // Validar stock para todos los productos
    for (let item of ventas) {
      const { producto, cantidad_vendida } = item;

      if (!ObjectId.isValid(producto)) {
        await session.abortTransaction();
        return res.status(400).json({ mensaje: `ID de producto no válido: ${producto}` });
      }

      const productDB = await Producto.findById(producto).session(session);

      if (!productDB) {
        await session.abortTransaction();
        return res.status(404).json({ mensaje: `Producto no encontrado: ${producto}` });
      }

      if (productDB.stock_actual < cantidad_vendida) {
        await session.abortTransaction();
        return res.status(400).json({ mensaje: `Stock insuficiente para ${productDB.nombre}` });
      }
    }

    // Si todo está bien, registrar ventas y actualizar stock
    const ventasGuardadas = [];

    for (let item of ventas) {
      const { producto, cantidad_vendida } = item;

      const nuevaVenta = new Venta({
        producto: new ObjectId(producto),
        fecha: new Date(),
        cantidad_vendida,
      });

      await nuevaVenta.save({ session });
      ventasGuardadas.push(nuevaVenta);

      // Actualizar stock
      const productDB = await Producto.findById(producto).session(session);
      productDB.stock_actual -= cantidad_vendida;
      await productDB.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ mensaje: 'Ventas registradas correctamente', ventas: ventasGuardadas });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error al registrar ventas:', error);
    res.status(500).json({ mensaje: 'Error al registrar ventas', error });
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
