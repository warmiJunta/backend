const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    try {
        if (!token.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Formato de token incorrecto" });
        }

        const tokenSinBearer = token.split(" ")[1];
        const decoded = jwt.verify(tokenSinBearer, process.env.JWT_SECRET);


        if (!decoded || !decoded.id) {
            return res.status(401).json({ msg: "Token no válido, falta el ID de usuario" });
        }

        req.user = decoded; // Aquí se asigna el usuario a req.user
        next();
    } catch (err) {
        console.error("Error al verificar el token:", err.message);
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = authMiddleware;
