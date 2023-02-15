const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
  },
  hoursPerWeek: {
    type: Number,
  },
  hourlyRate: {
    type: {
      min: Number,
      max: Number,
    },
    required: true,
  },
  salary: {
    type: {
      min: Number,
      max: Number,
    },
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["Tiempo Completo", "Media Jornada", "Temporal", "Freelancer"],
  },
  privacy: {
    type: String,
    required: true,
    enum: ["Publico", "Privado"],
  },
  jobActive: {
    type: Boolean,
  },
  description: {
    type: String,
    required: true,
  },
  responsibilities: [
    {
      type: String,
      required: true,
    },
  ],
  requiredSkills: [
    {
      type: String,
      enum: [
        "Programación",
        "Desarrollo Web",
        "Desarrollo de Aplicaciones",
        "Diseño Gráfico",
        "Análisis de Datos",
        "Marketing Digital",
        "Redacción",
        "Traducción",
        "Auditoría",
        "Otras",
      ],
    },
  ],
  requiredExperience: [
    {
      type: String,
      required: true,
    },
  ],
  applicants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
    },
  ],
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
