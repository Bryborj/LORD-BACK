const express = require("express");
const router = express.Router();
const { SLR } = require("ml-regression"); // <- Asegúrate de que esto esté bien

router.post("/prediccion", (req, res) => {
  const { ventas } = req.body;

  if (!ventas || ventas.length < 2) {
    return res.status(400).json({ error: "Se requieren al menos 2 ventas" });
  }

  try {
    const x = ventas.map((_, i) => i);  // [0, 1, 2, ...]
    const y = ventas;                   // [10, 12, 13, ...]

    const regression = new SLR(x, y);
    const nextIndex = ventas.length;
    const prediccion = regression.predict(nextIndex);

    res.json({ prediccion: parseFloat(prediccion.toFixed(2)) });
  } catch (err) {
    console.error("Error en predicción:", err.message);
    res.status(500).json({ error: "Error al predecir demanda" });
  }
});

module.exports = router;
