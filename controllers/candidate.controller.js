const Candidate = require("../models/candidate.model");
const verifyToken = require("../middlewares/verifyToken");

// @desc Get all candidates
// @route GET /candidate/all-candidates
// @access Private
const getAllCandidates = async (req, res) => {
  const candidates = await Candidate.find(
    {},
    {
      loginId: 1,
      photo: 1,
      firstName: 1,
      lastName: 1,
      location: 1,
      skills: { $slice: 3 },
    }
  );

  res.status(200).json({ status: "Succeeded", data: candidates, error: null });
};
// @desc Get candidate by loginId
// @route GET /candidate/:loginId
// @access Private
const getCandidateByLoginId = async (req, res) => {
  const loginId = req.params.loginId;

  const candidate = await Candidate.findOne({ loginId: loginId });

  if (!candidate) {
    return res.status(404).json({
      status: "Failed",
      data: null,
      error: "No se encontró el candidato con el loginId especificado",
    });
  }

  res.status(200).json({ status: "Succeeded", data: candidate, error: null });
};

module.exports = {
  getAllCandidates,
  getCandidateByLoginId,
};
