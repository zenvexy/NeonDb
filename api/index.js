require("dotenv").config();
const express = require("express");
const cors = require("cors");

const categoriasRoutes = require("./src/routes/categorias.routes");
const esfihasRoutes = require("./src/routes/esfihas.routes");
const enumsRoutes = require("./src/routes/enums.routes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/categorias", categoriasRoutes);
app.use("/esfihas", esfihasRoutes);
app.use("/enums", enumsRoutes);

const rotas = [
    { rota: "/", verbo: "GET" },
    { rota: "/categorias/listar", verbo: "GET" },
    { rota: "/categorias/cadastrar", verbo: "POST" },
    { rota: "/categorias/atualizar/:id", verbo: "PUT" },
    { rota: "/categorias/excluir/:id", verbo: "DELETE" },
    { rota: "/esfihas/listar", verbo: "GET" },
    { rota: "/esfihas/cadastrar", verbo: "POST" },
    { rota: "/esfihas/atualizar/:id", verbo: "PUT" },
    { rota: "/esfihas/excluir/:id", verbo: "DELETE" },
    { rota: "/enums/disponibilidade", verbo: "GET" }
];

app.get("/", (req, res) => {
    res.json({
        message: "API Esfiha Prime online",
        rotas
    });
});

module.exports = app;
