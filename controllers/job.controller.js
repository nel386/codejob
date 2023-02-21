const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Job = require("../models/job.model.js");
const Employer = require("../models/employer.model.js");
const Candidate = require("../models/candidate.model.js");
const Login = require("../models/auth.model.js");

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
};

// @Desc Get list jobs
// @Route GET /job/job-list
// @Access Public
const getJobList = async (req, res) => {
  try {
    const jobs = await Job.find(
      {},
      {
        logo: 1,
        privacy: 1,
        title: 1,
        company: 1,
        location: 1,
        salary: 1,
        createdAt: 1,
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
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    // Importar el dotenv
    const dotenv = require("dotenv");
    require("dotenv").config();

    // const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
    //Decoding the token

    const tokendecoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log(tokendecoded);
    // console.log(decodedToken);

    // Obtener los datos del usuario
    const {
      title,
      description,
      jobSkills,
      jobType,
      salary,
      location,
      privacy,
    } = req.body;
    const loginId = decodedToken.UserInfo.id;

    // Buscar la información del empleador usandoel loginId
    const employer = await Employer.findOne({ loginId: loginId });
    // Si no se encuentra el empleador, se retorna un estatus 404 y un mensaje de error
    if (!employer) {
      return res.status(404).json({
        status: "Failed",
        data: null,
        error: "No se encontró el empleador con el loginId especificado",
      });
    }

    // Crear un nuevo objeto Job con los datos recibidos en la petición
    const newJob = new Job({
      title: title,
      description: description,
      jobSkills: jobSkills,
      jobType: jobType,
      salary: salary,
      location: location,
      privacy: privacy,
      company: employer._id,
      logo: employer.logo,
      applicants: [],
    });

    // Guardar el nuevo trabajo en la base de datos
    await newJob.save();

    // Retornar un estatus 201 y un mensaje de éxito
    res.status(201).json({
      status: "Succeeded",
      data: "La oferta de trabajo ha sido creada exitosamente",
      error: null,
    });
  } catch (error) {
    // Si hay un error en la creación de la oferta de trabajo, se retorna un estatus 500 y un mensaje de error
    res.status(500).json({
      status: "Failed",
      data: null,
      error: error.message,
    });
  }
};

module.exports = {
  getAllJobs,
  getJobsAppliedByLoginId,
  removeJobApplication,
  getJobList,
  createJob,
};
