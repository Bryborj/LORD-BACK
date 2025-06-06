# LORD-BACK

LORD-BACK es un backend desarrollado en Node.js y Express orientado a la gestión de ventas, productos, usuarios y predicción de demanda para pequeñas y medianas empresas (pymes). Utiliza MongoDB como base de datos y proporciona endpoints RESTful para la administración de inventario, autenticación de usuarios y análisis de ventas.

## Características principales
- **Gestión de productos:** Alta, baja, modificación y consulta de productos con control de stock.
- **Gestión de ventas:** Registro de ventas individuales y por carrito, con actualización automática del inventario.
- **Usuarios y autenticación:** Registro y login de usuarios con roles (admin y empleado), utilizando JWT para la autenticación.
- **Predicción de demanda:** Endpoint para predecir la demanda futura de productos usando regresión lineal simple.
- **Control de tickets:** Administración de tickets para seguimiento de incidencias o soporte.
- **API segura:** Middleware para proteger rutas sensibles mediante autenticación.

## Tecnologías utilizadas
- Node.js
- Express
- MongoDB y Mongoose
- JWT (JSON Web Token)
- Bcrypt para hash de contraseñas
- ml-regression para predicción

## Estructura del proyecto
- `/models`: Modelos de datos (Producto, Venta, Usuario, Ticket)
- `/routes`: Rutas de la API (productos, ventas, usuarios, autenticación, predicción, tickets)
- `/middleware`: Middlewares de autenticación y utilidades
- `server.js`: Configuración principal del servidor y conexión a la base de datos

Este backend está diseñado para integrarse fácilmente con un frontend y servir como base para sistemas de gestión de pymes con necesidades de inventario, ventas y análisis predictivo.

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd LORD-BACK
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
     ```env
     MONGO_URI=<cadena-de-conexion-mongodb>
     PORT=5000
     JWT_SECRET=<tu_secreto_jwt>
     ```
4. **Inicia el servidor:**
   ```bash
   npm start
   ```
   El backend estará disponible en `http://localhost:5000`.

## Notas
- Asegúrate de tener una instancia de MongoDB en funcionamiento.
- Puedes modificar el puerto y otros parámetros en el archivo `.env` según tus necesidades.
