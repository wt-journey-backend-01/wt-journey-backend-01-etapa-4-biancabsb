const express = require('express')
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./utils/errorHandler');
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
import agentesRoutes from "./routes/authRoutes";

const app = express();
const PORT = 3000;
const swaggerDocument = require('./docs/swagger.json');
app.use(express.json());

app.use("/agentes", agentesRoutes);
app.use("/casos", casosRoutes);
app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRoutes);

app.get("/docs-swagger", (req, res) => {
    res.sendFile(__dirname + '/swagger.json');
});

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
