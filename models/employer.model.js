const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employerSchema = new Schema({
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
  isLookingForEmployees: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  logo: {
    type: String,
  },
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
