const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 80;

app.use(express.static(path.join(`${__dirname}/pages`)));

app.get("/", (req, res) => {
    res.sendFile(path.join(`${__dirname}/pages`, "index.html"));
});

// app.get("/", (req, res) => {
//     res.sendFile(path.join(`${__dirname}/pages`, "login.html"));
// });

// app.get("/register", (req, res) => {
//     res.sendFile(path.join(`${__dirname}/pages`, "register.html"));
// });

app.get("/test", (req, res) => {
    res.sendFile(path.join(`${__dirname}/pages`, "test.html"));
});

app.listen(port, () => {
    console.log(`Server listening on server http://localhost:${port}`);
});
