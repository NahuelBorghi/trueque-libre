const BaseException = require("../exceptions/BaseException");
const crypto = require("crypto"); // Módulo de criptografía de Node.js

const secretKey = process.env.JWT_SECRET ?? "AguanteBoca12"; // Clave secreta para firmar el token
const pattern = process.env.JWT_PATTERN ?? "BOCA"; // Patrón para insertar en el token

// Codifica una cadena en base64 URL
function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

// HMAC con SHA-256 para crear una firma segura del mensaje.
async function generateHmac(key, message) {
    const keyBytes = new TextEncoder().encode(key); // Convierte la clave a bytes
    const msgBytes = new TextEncoder().encode(message); // Convierte el mensaje a bytes

    // Importa la clave para usarla con HMAC
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
    );
    // Firma el mensaje usando la clave y HMAC-SHA-256
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgBytes);
    const sigBytes = new Uint8Array(signature);
    // Codifica la firma en base64 URL
    return base64UrlEncode(Buffer.from(sigBytes).toString("base64"));
}

// Genera un token JWT
async function generateToken(payload) {
    // Encabezado (por defecto para HS256)
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));

    // Carga útil
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    // Firma
    const signingString = `${encodedHeader}.${encodedPayload}`;

    // Importar clave criptográfica para HMAC
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secretKey),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(signingString)
    );
    const encodedSignature = base64UrlEncode(
        Buffer.from(new Uint8Array(signature)).toString("base64")
    );

    // Token completo
    const token = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
    return token;
}

// Verifica un token JWT
async function verifyToken(token) {
    // Elimina el patrón del token antes de verificar
    const cleanedToken = token.replace(new RegExp(pattern, "g"), "");

    const [header, body, signature] = cleanedToken.split("."); // Divide el token en sus partes
    const newSignature = await generateHmac(secretKey, `${header}.${body}`); // Genera una nueva firma para verificar
    if (newSignature === signature) {
        // Si la firma coincide, el token es válido
        return JSON.parse(Buffer.from(body, "base64").toString("utf8"));
    } else {
        // Si la firma no coincide, el token es inválido
        throw new BaseException(
            "Invalid token",
            401,
            "Unauthorized",
            "ValidationError"
        );
    }
}

module.exports = { generateToken, verifyToken };
