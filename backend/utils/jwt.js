const BaseException = require("../exceptions/BaseException");

const secretKey = process.env.JWT_SECRET?? "AguanteBoca"; // Clave secreta para firmar el token
const pattern = process.env.JWT_PATTERN??"BOCA"; // Patrón para insertar en el token
const patternInterval = parseInt(process.env.JWT_PATTERN_INTERVAL, 10) ?? 10; // Convertir a número

// Codifica una cadena en base64 URL
function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

// HMAC (Hash-based Message Authentication Code) es un mecanismo para verificar la integridad y autenticidad de un mensaje
// utilizando una combinación de una función hash criptográfica y una clave secreta.
// En este caso, utilizamos HMAC con SHA-256 para crear una firma segura del mensaje.
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
    return base64UrlEncode(String.fromCharCode(...sigBytes));
}

// Función para insertar un patrón en una cadena cada n caracteres
function insertPattern(str, pattern, interval) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        if (i > 0 && i % interval === 0) {
            result += pattern;
        }
        result += str[i];
    }
    return result;
}

// Genera un token JWT con un patrón específico
async function generateToken(payload) {
    const header = base64UrlEncode(
        JSON.stringify({ alg: "HS256", typ: "JWT" })
    ); // Codifica el encabezado en base64 URL
    const body = base64UrlEncode(JSON.stringify(payload)); // Codifica el cuerpo en base64 URL
    const signature = await generateHmac(secretKey, `${header}.${body}`); // Genera la firma HMAC
    let token = `${header}.${body}.${signature}`; // Token JWT completo
    token = insertPattern(token, pattern, patternInterval); // Inserta el patrón especificado cada n caracteres
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
        throw new BaseException("Invalid token", 401, "Unauthorized", "ValidationError");
    }
}

module.exports = { generateToken, verifyToken };
