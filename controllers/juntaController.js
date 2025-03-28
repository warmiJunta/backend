const Junta = require('../models/Juntas');
const User = require('../models/User');

// Crear una nueva junta
const crearJunta = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(400).json({ msg: "Error: No se encontró el ID del usuario." });
    }
    try {
        const { monto_objetivo, aporte, num_participantes, frecuencia_aportes, duracion } = req.body;
        const nuevaJunta = new Junta({
            monto_objetivo,
            aporte,
            num_participantes,
            frecuencia_aportes,
            duracion,
            creador: req.user.id,
        });
        await nuevaJunta.save();
        res.status(201).json({ msg: 'Junta creada correctamente', junta: nuevaJunta });
    } catch (error) {
        console.error("Error al crear la junta:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// Buscar juntas con filtros
const buscarJuntas = async (req, res) => {
    try {
        let { aporte_mensual, frecuencia_aportes, monto_objetivo } = req.query;
        let filtro = {};

        if (aporte_mensual) filtro.aporte_mensual = Number(aporte_mensual);
        if (monto_objetivo) filtro.monto_objetivo = Number(monto_objetivo);
        if (frecuencia_aportes) filtro.frecuencia_aportes = frecuencia_aportes;

        const juntas = await Junta.find(filtro);
        if (!juntas.length) {
            return res.status(404).json({ msg: "No se encontraron juntas con esos criterios" });
        }
        res.json(juntas);
    } catch (error) {
        console.error("Error al buscar juntas:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// Unirse a una junta
const unirseJunta = async (req, res) => {
    const { juntaId } = req.body;
    const usuarioId = req.user.id;

    try {
        const junta = await Junta.findById(juntaId);
        if (!junta) return res.status(404).json({ msg: 'Junta no encontrada' });
        if (junta.creador.toString() === usuarioId) return res.status(400).json({ msg: 'El creador no puede unirse a su propia junta' });
        if (junta.participantes.includes(usuarioId)) return res.status(400).json({ msg: 'Ya eres parte de esta junta' });
        if (junta.participantes.length >= junta.num_participantes) return res.status(400).json({ msg: 'La junta ya está completa' });

        junta.participantes.push(usuarioId);
        await junta.save();
        res.json({ msg: 'Te has unido a la junta con éxito', junta });
    } catch (error) {
        console.error("Error al unirse a la junta:", error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// Obtener todas las juntas
const obtenerJuntas = async (req, res) => {
    try {
        const juntas = await Junta.find();
        res.json(juntas);
    } catch (error) {
        console.error("Error al obtener las juntas:", error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

module.exports = { crearJunta, buscarJuntas, unirseJunta, obtenerJuntas };