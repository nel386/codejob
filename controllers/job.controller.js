const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../middlewares/verifyToken");

const Job = require("../models/job.model.js");
const Employer = require("../models/employer.model.js");
const Candidate = require("../models/candidate.model.js");
const Login = require("../models/auth.model.js");

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

// Endpoint para obtener todas las ofertas de trabajo activas
router.get("/all-jobs", verifyToken, async (req, res) => {
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

// Endpoint para obtener todas las ofertas de trabajo a las que ha aplicado un candidato
router.get("/jobs-applied/:loginId", verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find({});
    const jobsWithApplicantsCount = await Promise.all(
      jobs.map(async (job) => {
        const count = job.applicants.length;

        return {
          _id: job._id,
          title: job.title,
          createdAt: job.createdAt,
          expirationDate: job.expirationDate,
          jobActive: job.jobActive,
          location: job.location,
          logo: job.company.logo,
          applicantsCount: count,
        };
      })
    );

    res.status(200).json({
      status: "Succeeded",
      data: jobsWithApplicantsCount,
      error: null,
    });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
});

// Endpoint para eliminar la inscripción a un trabajo específico
router.delete("/jobs-applied/:loginId/:jobId", async (req, res) => {
  try {
    // Obtener el jobId y el loginId de los parámetros de la URL
    const jobId = req.params.jobId;
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

    // Buscar el registro del trabajo en la base de datos usando el jobId
    const job = await Job.findOne({ _id: jobId });

    // Si el trabajo no se encuentra, se retorna un estatus 404 y un mensaje de error
    if (!job) {
      return res.status(404).json({
        status: "Failed",
        data: null,
        error: "No se encontró la oferta de trabajo con el jobId especificado",
      });
    }

    // Eliminar el jobId de la lista de appliedJobs del candidato
    candidate.appliedJobs = candidate.appliedJobs.filter(
      (appliedJob) => appliedJob.toString() !== jobId
    );

    // Eliminar el loginId de la lista de applicants del trabajo
    job.applicants = job.applicants.filter(
      (applicant) => applicant.toString() !== loginId
    );

    // Guardar los cambios en la base de datos
    await candidate.save();
    await job.save();

    // Retornar un estatus 200 y un mensaje de éxito
    res.status(200).json({
      status: "Succeeded",
      data: "La inscripción a la oferta de trabajo ha sido eliminada exitosamente",
      error: null,
    });
  } catch (error) {
    // Si hay un error en la eliminación de la inscripción, se retorna un estatus 500 y un mensaje de error
    res.status(500).json({
      status: "Failed",
      data: null,
      error: error.message,
    });
  }
});

router.get("/job-list", async (req, res) => {
  try {
    // Obtener todas las ofertas de trabajo de la base de datos
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "employers",
          localField: "company",
          foreignField: "_id",
          as: "companyInfo",
        },
      },
      {
        $project: {
          logo: "$companyInfo.logo",
          privacy: "$privacy",
          title: "$title",
          company: "$companyInfo.companyName",
          location: "$location",
          averageSalary: {
            $avg: ["$salary.min", "$salary.max"],
          },
          createdAt: "$createdAt",
        },
      },
    ]);
    // Si se encuentran ofertas de trabajo, se retornan con un estatus 200
    res.status(200).json({ status: "Succeeded", data: jobs, error: null });
  } catch (error) {
    // Si hay un error en la búsqueda de ofertas de trabajo, se retorna un estatus 404 y un mensaje de error
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
});

//Endpoint para postear una oferta de trabajo por parte de un empleador
//FALTA ENLAZAR LA OFERTA DE TRABAJO CON EL EMPLEADOR QUE LA POSTEA
router.post("/post-job", async (req, res) => {
  try {
    const {
      title,
      description,
      jobSkills,
      jobType,
      salary,
      carreerLevel,
      yearExperience,
      requiredExperience,
      expirationDate,
      location,
      privacy,
      responsibilities,
    } = req.body;

    const newJob = new Job({
      title,
      description,
      jobSkills,
      jobType,
      salary,
      carreerLevel,
      experience: { yearExperience, requiredExperience },
      expirationDate,
      location: {
        country: location.country,
        city: location.city,
        address: location.address,
      },
      createdAt: new Date(),
      privacy,
      responsibilities,
    });

    const savedJob = await newJob.save();

    res.status(201).json({
      message: "Trabajo creado exitosamente",
      job: savedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el trabajo",
      error: error.message,
    });
  }
});

module.exports = router;
