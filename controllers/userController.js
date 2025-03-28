const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de usuario
const registerUser = async (req, res) => {
    console.log("Datos recibidos:", req.body);

    const { nombre, documento_identidad, numero, contraseña } = req.body;

    if (!nombre || !documento_identidad || !numero || !contraseña) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        const nuevoUsuario = new User({
            nombre,
            documento_identidad,
            numero,
            contraseña: hashedPassword
        });

        await nuevoUsuario.save();
        res.status(201).json({ msg: "Usuario creado exitosamente" });

    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// Login de usuario
const loginUser = async (req, res) => {
    const { documento_identidad, numero, contraseña } = req.body;

    try {
        const usuario = await User.findOne({ documento_identidad, numero });

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esCorrecta) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        // Generar token
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ msg: "Login exitoso", token });

    } catch (err) {
        console.error("Error en el login:", err);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const usuarios = await User.find();
        res.json(usuarios);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers
};


