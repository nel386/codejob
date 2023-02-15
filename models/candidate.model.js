const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
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
  resume: {
    type: String,
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
