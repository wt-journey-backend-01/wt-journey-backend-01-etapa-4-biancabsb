const express = require("express");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./utils/errorHandler");
const agentesRoutes = require("./routes/agentesRoutes");
const casosRoutes = require("./routes/casosRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;
const swaggerDocument = require("./docs/swagger.json");

app.use(express.json());

// Rotas
app.use("/agentes", agentesRoutes);
app.use("/casos", casosRoutes);
app.use("/api/auth", authRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Arquivo JSON direto
app.get("/docs-swagger", (req, res) => {
  res.sendFile(__dirname + "/docs/swagger.json");
});

// Middleware de erro (deve ficar depois das rotas)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`
  );
});
