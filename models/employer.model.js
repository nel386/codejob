const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employerSchema = new Schema({
  role: {
    type: Schema.Types.String,
    ref: "Login",
  },
  loginId: {
    type: Schema.Types.ObjectId,
    ref: "Login",
  },
  username: {
    type: Schema.Types.String,
    ref: "Login",
  },
  email: {
    type: Schema.Types.String,
    ref: "Login",
  },
  companyName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  createdCompanyAt: {
    type: Date,
    required: true,
  },
  employeesNumber: {
    type: Number,
    required: true,
  },
  companyType: {
    type: String,
    required: true,
    enum: [
      "consultoría",
      "tecnología",
      "educación",
      "salud",
      "finanzas",
      "recursos humanos",
      "marketing",
      "servicios",
      "construcción",
      "transporte",
      "ventas",
      "otro",
    ],
  },
  isLookingForEmployees: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  socialNetworks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    github: { type: String },
    googlePlus: { type: String },
  },
  contactInformation: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },
  logo: {
    type: String,
  },
  cover: {
    type: String,
  },
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
