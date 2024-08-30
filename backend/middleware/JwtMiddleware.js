const BaseException = require("../exceptions/BaseException");
const { verifyToken } = require("../utils/jwt");

// Middleware para verificar el JWT
async function jwtMiddleware(req, res, next) {
    const excludedPaths = ["/user/login", "/user/register", "/user/"]; // Añade aquí las rutas que quieres excluir

    // Excluir ciertas rutas del middleware
    if (excludedPaths.some((path) => req.path.startsWith(path))) {
        return next();
    }

    try {
        // Obtener el token de la cabecera de autorización
        const token =
            req.headers.authorization && req.headers.authorization.split(" ")[1];

        if (!token) {
            throw new BaseException("Token not provided", 401, "Unauthorized", "AuthenticationError");
        }

        // Verificar el token
        const decoded = await verifyToken(token);
        req.user = decoded; // Almacenar el payload decodificado en req.user
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = jwtMiddleware;
