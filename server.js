const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
require("dotenv").config();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
// Rutas
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ventas", require("./routes/ventaRoutes"));
app.use("/api/user", require("./routes/users"));
app.use("/api/tickets", require("./routes/tickets"));
app.use('/api', require('./routes/prediccionRoutes'));


// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    // Iniciar servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err.message);
  });
