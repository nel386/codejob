const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  role: {
    type: Schema.Types.String,
    ref: "Login",
  },
  loginId: {
    type: Schema.Types.ObjectId,
    ref: "Login",
  },
  userName: {
    type: Schema.Types.String,
    ref: "Login",
  },
  email: {
    type: Schema.Types.String,
    ref: "Login",
  },
  fullName: {
    type: String,
    required: true,
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
    ref: "Login",
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
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employer" }],
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
