// Función para parsear cookies manualmente
function parseCookies(req, res, next) {
    const list = {};
    const cookieHeader = req.headers?.cookie;

    if (cookieHeader) {
        // Dividir el header de cookies por '; ' para obtener cada cookie individualmente
        cookieHeader.split(";").forEach((cookie) => {
            let [name, ...rest] = cookie.split("="); // Separar nombre y valor
            name = name?.trim(); // Eliminar espacios
            const value = rest.join("=").trim(); // Unir el valor si contiene '='
            if (name && value) {
                list[name] = decodeURIComponent(value); // Decodificar el valor de la cookie
            }
        });
    }

    req.cookies = list;
    next(); // Pasar al siguiente middleware
}

module.exports = { parseCookies };
