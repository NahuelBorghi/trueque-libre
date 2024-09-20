const crypto = require("crypto");
const salt = process.env.JWT_SECRET ?? "AguanteBoca12"
// Función para hashear una contraseña
function hashFunciton(password, digest = "sha512") {
    const iterations = 1212;
    const keylen = 64; // Longitud de la clave generada

    const hash = crypto
        .pbkdf2Sync(password, salt, iterations, keylen, digest) // revisar porque el hash repite el hash
        .toString("hex");

    return { hash, salt };
}

function verifyHash(password, hash) {
    const newHash = crypto
        .pbkdf2Sync(password, salt, 1212, 64, "sha512")
        .toString("hex");
    return hash === newHash;
}

module.exports = { hashFunciton, verifyHash };
