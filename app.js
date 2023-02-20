const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
mongoose.set("strictQuery", true);

// Importar controladores
const jobs = require("./controllers/job.controller");
const candidates = require("./controllers/candidate.controller");
// const employers = require("./controllers/employer.controller");
// const logins = require("./controllers/login.controller");

// Configurar variables de entorno
dotenv.config();

// Crear aplicación de Express
const app = express();

// Habilitar CORS
app.use(cors());

// Conectarse a la base de datos de MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});

// Verificar la conexión a la base de datos
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Configurar middleware para recibir y enviar JSON
app.use(express.json());

// Definir rutas de servidor
app.use("/job", jobs);
app.use("/candidate", candidates);

// Escuchar peticiones en el puerto especificado en el puerto 8000
const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
