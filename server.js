const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const juntaRoutes = require('./routes/juntaRoutes');

// 💡 Cargar variables de entorno antes de usarlas
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Para parsear el cuerpo de las peticiones

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/juntas', juntaRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
