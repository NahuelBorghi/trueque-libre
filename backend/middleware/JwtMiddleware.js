const BaseException = require("../exceptions/BaseException");
const { verifyToken } = require("../utils/jwt");

// Middleware para verificar el JWT desde una cookie
async function jwtMiddleware(req, res, next) {
    const excludedPaths = ["/user/login", "/user/register"]; // Rutas excluidas

    // Excluir ciertas rutas del middleware
    if (excludedPaths.some((path) => req.path.startsWith(path))) {
        console.log('excludedPath', req.path)
        return next();
    }

    try {
        // Obtener el token desde la cookie 'nombreCookie'
        let token = req.cookies["nombreCookie"];
        console.log('token', token)
        if (!token) {
            console.log('no token')
            throw new BaseException(
                "Token not provided",
                403,
                "Unauthorized",
                "AuthenticationError"
            );
        }

        // Decodificar el token (en caso de que esté URL-encoded)
        token = decodeURIComponent(token);

        // Verificar el token
        const decoded = await verifyToken(token);
        req.user = decoded; // Almacenar el payload decodificado en req.user
        next();
    } catch (error) {
        console.log('error token', error)
        res.status(error.statusCode).send(error)
    }
}

module.exports = jwtMiddleware;
