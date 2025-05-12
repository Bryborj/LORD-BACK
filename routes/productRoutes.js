const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verificarToken = require("../middleware/authMiddleware");

// Obtener todos los productos
router.get("/", async (req, res) => {
  const productos = await Product.find();
  res.json(productos);
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// GET /api/ventas?producto=nombreProducto
router.get("/", async (req, res) => {
    try {
        const { producto } = req.query;

        const filtro = producto
            ? { nombre_producto: producto } // <-- campo que usas en tu modelo de ventas
            : {};

        const ventas = await Venta.find(filtro);
        res.json(ventas);
    } catch (err) {
        console.error("Error al obtener ventas:", err.message);
        res.status(500).json({ error: "Error al obtener ventas" });
    }
});


// Crear un nuevo producto
router.post("/", async (req, res) => {
  const producto = new Product(req.body);
  try {
    const nuevoProducto = await producto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
});

// Actualizar producto
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const actualizado = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
});

// Eliminar producto
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
});

module.exports = router;
