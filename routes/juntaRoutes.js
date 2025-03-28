const express = require('express');
const { crearJunta, buscarJuntas, unirseJunta, obtenerJuntas } = require('../controllers/juntaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/crear',authMiddleware, crearJunta);
router.get('/buscar', buscarJuntas);
router.post('/unirse,authMiddleware', unirseJunta);
router.get('/', obtenerJuntas);

module.exports = router;