const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
mongoose.set("strictQuery", true);

// Importacion de Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Importar middlewares de log y manejo de errores
const { logger, logEvents } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

// Configurar variables de entorno
require("dotenv").config();

// Crear aplicación de Express
const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Habilitar CORS
app.use(cors());

// Conectarse a la base de datos de MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});

// Verificar la conexión a la base de datos
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
// Configurar middleware para recibir y enviar JSON
app.use(express.json());

//Definir rutas de autenticación
app.use(logger);
app.use("/auth", require("./routes/auth.routes"));
app.use(errorHandler);

// Definir rutas de jobs
app.use("/job", require("./routes/job.routes"));

// Definir rutas de candidates
app.use("/candidate", require("./routes/candidate.routes"));

// Definir rutas de employers
// app.use("/employer", require("./routes/employer.routes"));

// Escuchar peticiones en el puerto especificado en el puerto 8000
const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
