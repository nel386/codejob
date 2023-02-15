// //Importar los módules Express y Mongoose
// const express = require("express");
// const mongoose = require("mongoose");
// mongoose.set("strictQuery", true);
// const cors = require("cors");

// //Obtener la info del archivo env
// require("dotenv").config();

// // //Importación de los controladores
// const candidates = require("./controllers/candidate.controller");
// const employers = require("./controllers/employer.controller");
// const jobs = require("./controllers/job.controller");

// // //Almacenar la cadena de conexión
// const mongoString = process.env.DATABASE_URL;

// // //Conectar con la base de datos
// mongoose.connect(mongoString, {
  // useNewUrlParser: true,
// });

// // //Guardar la conexión
// const db = mongoose.connection;

// // //Verificar si la conexión fue exitosa
// db.on("error", (error) => {
//   console.log(error);
// });

// // //Se ejecuta una única vez, que es cuando se conecta a la db, en lugar de en cada petición
// db.once("connected", () => {
//   console.log("Succesfully connected");
// });

// // //Recibir una notificación cuando la conexión se haya cerrado
// db.once("disconnected", () => {
//   console.log("Mongoose default conection is disconnected");
// });

// // //Asignar puerto
// const PORT = 8000;

// // //Analizar archivos json
// const app = express();
// app.use(express.json());

// // //Configurar CORS
// app.use(cors());

// // //Configurar las rutas
// // app.use("/candidate", candidates);
// // app.use("/employer", employers);
// app.use("/job", jobs);

// app.listen(PORT, () => {
  // console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
mongoose.set("strictQuery", true);


// Importar controladores
const jobs = require("./controllers/job.controller");


// Configurar variables de entorno
require("dotenv").config();

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

// Escuchar peticiones en el puerto especificado en las variables de entorno o en el puerto 8000
const port = 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
