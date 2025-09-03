import express from "express";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./utils/errorHandler.js";
import agentesRoutes from "./routes/agentesRoutes.js";
import casosRoutes from "./routes/casosRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import swaggerDocument from "./docs/swagger.js"

const app = express();
const PORT = 3000;

app.use(express.json());

// Rotas
app.use("/agentes", agentesRoutes);
app.use("/casos", casosRoutes);
app.use("/auth", authRoutes); 

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Arquivo JSON direto
app.get("/docs-swagger", (req, res) => {
  res.sendFile(new URL("./docs/swagger.json", import.meta.url).pathname);
});

// Middleware de erro (deve ficar depois das rotas)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`
  );
});
