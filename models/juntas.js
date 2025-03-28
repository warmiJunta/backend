const mongoose = require('mongoose');

const JuntaSchema = new mongoose.Schema({
  monto_objetivo: {
    type: Number,
    required: true,
  },
  aporte: {  
    type: Number,
    required: true,
  },
  num_participantes: {
    type: Number,
    required: true,
  },
  frecuencia_aportes: {
    type: String,
    required: true,
  },
  duracion: {
    type: String,
    required: true,
  },
  creador: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participantes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Junta', JuntaSchema);
