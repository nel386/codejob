const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  role: {
    type: Schema.Types.String,
    ref: "Auth",
  },
  loginId: {
    type: Schema.Types.ObjectId,
    ref: "Auth",
  },
  userName: {
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

  bootcamp: {
    type: String,
    required: true,
  },
  edition: {
    type: Number,
    required: true,
  },

  languages: [
    {
      type: String,
      required: true,
    },
  ],
  socialNetworks: {
    linkedin: String,
    github: String,
  },
  description: {
    type: String,
    required: true,
  },
  registerAt: {
    type: Schema.Types.Date,
    ref: "Auth",
  },
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
