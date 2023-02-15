const express = require("express");
const router = express.Router();

const Job = require("../models/job.model.js");
const Employer = require("../models/employer.model.js");

// Endpoint para obtener todas las ofertas de trabajo activas
router.get("/manage-jobs.", async (req, res) => {
  try {
    // Buscar todas las ofertas de trabajo activas en la base de datos
    const jobs = await Job.find({ jobActive: true }).populate("company");
    // Si se encuentran ofertas de trabajo activas, se retornan con un estatus 200
    res.status(200).json({ status: "Succeeded", data: jobs, error: null });
  } catch (error) {
    // Si hay un error en la búsqueda de ofertas de trabajo, se retorna un estatus 404 y un mensaje de error
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
});

module.exports = router;

// Este endpoint se encarga de buscar todas las ofertas de trabajo activas en la base de datos y retornarlas al cliente.
// En caso de que haya un error en la búsqueda, se retorna un estatus 404 y un mensaje de error.
// La información de la oferta de trabajo incluye el nombre, número de empleados solicitando ese empleo, la categoría, la ubicación de la oferta, el logotipo de la empresa, la fecha de creación y expiración de la oferta.
