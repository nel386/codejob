const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Job = require("../models/job.model.js");
const Employer = require("../models/employer.model.js");
const Candidate = require("../models/candidate.model.js");
const Login = require("../models/auth.model.js");
const asyncHandler = require("express-async-handler");

// @Desc Get all jobs
// @Route GET /job/all-jobs
// @Access Private
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ jobActive: true }).populate("company");
    res.status(200).json({ status: "Succeeded", data: jobs, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
};

// @Desc Get job by jobId
// @Route GET /job/jobs-applied/:jobId
// @Access Private
const getJobsAppliedByLoginId = async (req, res) => {
  try {
    const loginId = req.params.loginId;
    const jobs = await Job.find({
      applicants: { $elemMatch: { applicantId: loginId } },
    });
    const jobsWithApplicantsCount = await Promise.all(
      jobs.map(async (job) => {
        const count = job.applicants.length;
        return {
          _id: job._id,
          title: job.title,
          createdAt: job.createdAt,
          jobActive: job.jobActive,
          location: job.location,
          logo: job.logo,
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
};
// @Desc Delete job by jobId
// @Route DELETE /job/jobs-applied/:loginId/:jobId
// @Access Private
const removeJobApplication = async (req, res) => {
  try {
    // Obtener el jobId y el loginId de los parámetros de la URL
    const jobId = req.params.jobId;
    const loginId = req.params.loginId;

    // Buscar el trabajo en la base de datos usando el jobId
    const job = await Job.findOne({ _id: jobId });

    // Si el trabajo no se encuentra, se retorna un estatus 404 y un mensaje de error
    if (!job) {
      return res.status(404).json({
        status: "Failed",
        data: null,
        error: "No se encontró la oferta de trabajo con el jobId especificado",
      });
    }

    // Buscar si el loginId del candidato está en la lista de applicants
    const applicantIndex = job.applicants.findIndex(
      (applicant) => applicant.applicantId.toString() === loginId
    );

    // Si el candidato no se encuentra inscrito en el trabajo, se retorna un estatus 400 y un mensaje de error
    if (applicantIndex === -1) {
      return res.status(400).json({
        status: "Failed",
        data: null,
        error:
          "El usuario no se encuentra inscrito en la oferta de trabajo especificada",
      });
    }

    // Eliminar el objeto del candidato de la lista de applicants
    job.applicants.splice(applicantIndex, 1);

    // Guardar los cambios en la base de datos
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
};

// @Desc Get list jobs
// @Route GET /job/job-list
// @Access Public
const getJobList = async (req, res) => {
  try {
    const jobs = await Job.find(
      { jobActive: true },
      {
        title: 1,
        company: 1,
        companyName: 1,
        location: 1,
        logo: 1,
        jobActive: 1,
      }
    ).populate({
      path: "company",
      select: "logo companyName",
      model: "Employer",
    });
    res.status(200).json({ status: "Succeeded", data: jobs, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
};

// @desc Create a new job post
// @route POST /job/post-job
// @access Private
const createJob = async (req, res) => {
  try {
    // Verificar el token del usuario
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader;

    const decodedToken = jwt_decode(token);

    // Obtener los datos del usuario
    const { title, description, location, salary, jobType, jobActive } =
      req.body;
    const createdAt = new Date();

    // Buscar la información de la compañía
    const company = await Employer.findOne({
      loginId: decodedToken.UserInfo.id,
    });
    if (!company) {
      return res.status(400).json({
        message: "No se encontró la información de la compañía",
        data: null,
      });
    }

    // Crear una nueva oferta de trabajo
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      jobActive,
      createdAt,
      company: company._id,
      companyName: company.companyName,
      logo: company.logo,
    });

    await newJob.save();

    // Actualizar la información del empleador
    await Employer.findByIdAndUpdate(company._id, {
      $push: { jobs: newJob._id },
    });

    return res.status(201).json({
      message: "Oferta de trabajo creada exitosamente",
      data: newJob,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la oferta de trabajo",
      error,
    });
  }
};

// @Desc Get job by jobId
// @Route GET /job/job-single/:jobId
// @Access Public
const getJobByJobId = async (req, res) => {
  //Comprobar que hay token
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({
      status: "Failed",
      data: null,
      error: "No se ha proporcionado un token de autenticación",
    });
  }
  const jobId = req.params.jobId;
  console.log(jobId);
  const job = await Job.findById(jobId).exec();
  if (!job)
    return res.status(400).json({
      status: "Failed",
      data: null,
      error: `No se encontró la oferta de trabajo con el id ${jobId}`,
    });

  res.status(200).json({ status: "Succeeded", data: job, error: null });
};

module.exports = {
  getAllJobs,
  getJobsAppliedByLoginId,
  removeJobApplication,
  getJobList,
  createJob,
  getJobByJobId,
};
