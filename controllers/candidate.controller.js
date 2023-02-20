const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:loginId", verifyToken, async (req, res) => {
  try {
    // Obtener el loginId del candidato desde el parámetro de la URL
    const loginId = req.params.loginId;

    // Buscar el registro del candidato en la base de datos usando el loginId
    const candidate = await Candidate.findOne({ loginId: loginId });

    // Si el candidato no se encuentra, se retorna un estatus 404 y un mensaje de error
    if (!candidate) {
      return res.status(404).json({
        status: "Failed",
        data: null,
        error: "No se encontró el candidato con el loginId especificado",
      });
    }

    // Si se encuentra el candidato, se retorna con un estatus 200 y todos los campos del candidato
    res.status(200).json({ status: "Succeeded", data: candidate, error: null });
  } catch (error) {
    // Si hay un error en la búsqueda del candidato, se retorna un estatus 404 y un mensaje de error
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
});

const Job = require("../models/job.model.js");
const Employer = require("../models/employer.model.js");
const Candidate = require("../models/candidate.model.js");
const Login = require("../models/auth.model.js");

//Endpoint para obtener foto, nombre y apellido, especialidad, ubicación, media del salario por hora, y las tres primeras skills de todos los candidatos
router.get("/all-candidates", verifyToken, async (req, res) => {
  try {
    // Obtener los campos especificados de cada candidato en la base de datos
    const candidates = await Candidate.find(
      {},
      {
        photo: 1,
        firstName: 1,
        lastName: 1,
        especiality: 1,
        location: 1,
        hourlyRateAvg: { $avg: ["$hourlyRate.min", "$hourlyRate.max"] },
        skills: { $slice: 3 },
      }
    );
    // Si se encuentran candidatos, se retornan con un estatus 200
    res
      .status(200)
      .json({ status: "Succeeded", data: candidates, error: null });
  } catch (error) {
    // Si hay un error en la búsqueda de candidatos, se retorna un estatus 404 y un mensaje de error
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
});

router.get("/:loginId", verifyToken, async (req, res) => {
  try {
    // Obtener el loginId del candidato desde el parámetro de la URL
    const loginId = req.params.loginId;

    // Buscar el registro del candidato en la base de datos usando el loginId
    const candidate = await Candidate.findOne({ loginId: loginId });

    // Si el candidato no se encuentra, se retorna un estatus 404 y un mensaje de error
    if (!candidate) {
      return res.status(404).json({
        status: "Failed",
        data: null,
        error: "No se encontró el candidato con el loginId especificado",
      });
    }

    // Si se encuentra el candidato, se retorna con un estatus 200 y todos los campos del candidato
    res.status(200).json({ status: "Succeeded", data: candidate, error: null });
  } catch (error) {
    // Si hay un error en la búsqueda del candidato, se retorna un estatus 404 y un mensaje de error
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
});

module.exports = router;
