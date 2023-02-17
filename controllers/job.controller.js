const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { verifyToken } = require("../lib/util");

const Job = require("../models/job.model.js");
const Employer = require("../models/employer.model.js");
const Candidate = require("../models/candidate.model.js");
const Login = require("../models/login.model.js");

// Endpoint para obtener todas las ofertas de trabajo activas
router.get("/all-jobs", async (req, res) => {
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
router.get("/jobs-applied/:loginId", async (req, res) => {
  try {
    const jobs = await Job.find({});

    const jobsWithApplicantsCount = await Promise.all(
      jobs.map(async (job) => {
        const count = await Candidate.countDocuments({
          appliedJobs: { $in: [job._id] },
        });

        return {
          title: job.title,
          createdAt: job.createdAt,
          expirationDate: job.expirationDate,
          jobActive: job.jobActive,
          companyType: job.company.companyType,
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


module.exports = router;

