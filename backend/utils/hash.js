const crypto = require("crypto");

// Función para hashear una contraseña
function hashFunciton(password, salt = crypto.randomBytes(16).toString("hex")) {
    const iterations = 1212;
    const keylen = 64; // Longitud de la clave generada
    const digest = "sha512"; // Algoritmo hash a utilizar

    const hash = crypto
        .pbkdf2Sync(password, salt, iterations, keylen, digest)
        .toString("hex");

    return { hash, salt };
}

function verifyHash(password, hash, salt) {
    const newHash = crypto
        .pbkdf2Sync(password, salt, 1212, 64, "sha512")
        .toString("hex");
    return hash === newHash;
}

module.exports = { hashFunciton, verifyHash };
