const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  role: {
    type: Schema.Types.String,
    ref: "Auth",
  },
  AuthId: {
    type: Schema.Types.ObjectId,
    ref: "Auth",
  },
  username: {
    type: Schema.Types.String,
    ref: "Auth",
  },
  email: {
    type: Schema.Types.String,
    ref: "Auth",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  secondLastName: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },

  especiality: {
    type: String,
    required: true,
    enum: [
      "Desarrollador Frontend",
      "Desarrollador Backend",
      "Desarrollador FullStack",
      "DevOps",
      "QA",
      "Diseñador UX/UI",
      "Científico de Datos",
      "Analista de Datos",
      "Ingeniero de Datos",
      "Product Manager",
      "Analista",
      "Scrum Master",
      "Ventas",
      "Marketing",
      "Recruiter",
      "Otro",
    ],
  },

  currentSalary: {
    type: {
      min: Number,
      max: Number,
    },
    required: true,
  },
  expectedSalary: {
    type: {
      min: Number,
      max: Number,
    },
    required: true,
  },
  hourlyRate: {
    type: {
      min: Number,
      max: Number,
    },
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Masculino", "Femenino", "Otro"],
  },
  nationality: {
    type: String,
    required: true,
  },
  languages: [
    {
      type: String,
      required: true,
    },
  ],
  educationLevel: {
    type: String,
    required: true,
    enum: [
      "Primaria",
      "Secundaria",
      "Preparatoria/Bachillerato",
      "Técnico",
      "Licenciatura",
      "Maestría",
      "Doctorado",
      "Otro",
    ],
  },
  socialNetworks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    github: String,
  },
  skills: [
    {
      type: String,
      required: true,
    },
  ],
  education: [
    {
      title: {
        type: String,
        required: true,
      },
      place: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  awards: [
    {
      title: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  registerAt: {
    type: Schema.Types.Date,
    ref: "Auth",
  },
  images: [
    {
      type: String,
    },
  ],
  isLookingForJob: {
    type: Boolean,
    required: true,
  },
  appliedJobs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  resume: {
    type: String,
  },
  photo: {
    type: String,
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
