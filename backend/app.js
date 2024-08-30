const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const bodyParser = require("body-parser");
const BaseException = require("./exceptions/BaseException");
const jwtMiddleware = require("./middleware/JwtMiddleware");
const gzipResponseMiddleware = require("./middleware/gzipResponseMiddleware");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 8080;

// 1 verificar jwt, 2 rutas, 3 middleware para comprimir respuesta, 4 manejo de excepciones

// Middleware para comprimir respuesta (probar)
app.use(gzipResponseMiddleware)

// Middleware para manejar JWT
// app.use(jwtMiddleware);

// Rutas
app.use("/", routes);

// Middleware para manejar excepciones
app.use((err, req, res, next) => {
    if (err instanceof BaseException) {
        return res.status(err.statusCode).json(err.toJsonResponse());
    }
    return res.status(500).json({ status: "error", message: err.message });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});
