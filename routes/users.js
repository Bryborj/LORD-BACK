const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/authMiddleware');

// Ruta protegida para obtener el perfil del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: '❌Error al obtener el perfil de usuario', error });
    }
});

// Ruta para obtener todos los usuarios (solo para administradores)
router.get('/', verifyToken, async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Para no enviar las contraseñas
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: '❌ Error al obtener los usuarios', error });
    }
  });

// POST /api/usuarios/registrar
router.post('/registrar', verifyToken, async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.user); // <-- AGREGA ESTO
        // Solo permitir a administradores registrar nuevos usuarios
        const admin = await User.findById(req.user.id);
        if (admin.position !== 'admin') {
            return res.status(403).json({ message: '❌ No tienes permisos para registrar usuarios.' });
        }

        const { nombre, email, password, position } = req.body;

        // Validar que el correo no esté en uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '❌ El correo ya está en uso.' });
        }

        // Cifrar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear y guardar el nuevo usuario
        const newUser = new User({
            nombre,
            email,
            password: hashedPassword,  // Guardar la contraseña cifrada
            position: position || 'empleado'  // Si no se pasa position, se asigna "empleado"
        });

        await newUser.save();

        res.status(201).json({ message: '✅ Usuario registrado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '❌ Error al registrar usuario.', error });
    }
});

// Actualizar un usuario (solo admin)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const admin = await User.findById(req.user.id);
        if (admin.position !== 'admin') {
            return res.status(403).json({ message: '❌ No tienes permisos para actualizar usuarios.' });
        }

        const { nombre, email, password, position } = req.body;

        const updateData = { nombre, email, position };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: '❌ Usuario no encontrado.' });
        }

        res.json({ message: '✅ Usuario actualizado exitosamente.', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: '❌ Error al actualizar usuario.', error });
    }
});

// Eliminar un usuario (solo admin)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const admin = await User.findById(req.user.id);
        if (admin.position !== 'admin') {
            return res.status(403).json({ message: '❌ No tienes permisos para eliminar usuarios.' });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: '❌ Usuario no encontrado.' });
        }

        res.json({ message: '✅ Usuario eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: '❌ Error al eliminar usuario.', error });
    }
});


module.exports = router;
