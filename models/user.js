const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    documento_identidad: { 
        type: String, 
        enum: ['DNI', 'CEX', 'PASAPORTE'], // 🔹 Asegura que el tipo sea válido
        required: true 
    },
    numero: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                if (!this.documento_identidad) return false; // 🔥 Evita el "tipo desconocido"

                const regex = {
                    'DNI': /^\d{8}$/,           // Ejemplo: 12345678
                    'CEX': /^[A-Z0-9]{9}$/,     // Ejemplo: A12345678
                    'PASAPORTE': /^[A-Z0-9]{6,9}$/ // Ejemplo: AB123456
                };

                return regex[this.documento_identidad]?.test(value) || false;
            },
            message: props => `Número de documento inválido para ${props.value} (${props.instance?.documento_identidad || "tipo desconocido"})`
        }
    },
    contraseña: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
