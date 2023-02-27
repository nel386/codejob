const Candidate = require("../models/candidate.model");
const verifyToken = require("../middlewares/verifyToken");

// @Desc Obtener todos los candidatos
// @Route GET /candidate/all-candidates
// @Acceso Privado
const getAllCandidates = async (req, res) => {
  // Buscar todos los candidatos en la base de datos
  const candidates = await Candidate.find(
    {},
    {
      // Seleccionar solo los campos específicos
      loginId: 1,
      photo: 1,
      firstName: 1,
      lastName: 1,
      bootcamp: 1,
      registerAt: 1,
    }
  );

  // Retornar un estatus 200 y los datos de los candidatos
  res.status(200).json({ status: "Succeeded", data: candidates, error: null });
};

// @Desc Obtener un candidato por su loginId
// @Route GET /candidate/:loginId
// @Acceso Privado
const getCandidateByLoginId = async (req, res) => {
  // Obtener el loginId del parámetro de la URL
  const loginId = req.params.loginId;

  // Buscar el candidato en la base de datos usando el loginId
  const candidate = await Candidate.findOne({ loginId: loginId });

  // Si el candidato no se encuentra, se retorna un estatus 404 y un mensaje de error
  if (!candidate) {
    return res.status(404).json({
      status: "Failed",
      data: null,
      error: "No se encontró el candidato con el loginId especificado",
    });
  }

  // Retornar un estatus 200 y la información del candidato
  res.status(200).json({ status: "Succeeded", data: candidate, error: null });
};

module.exports = {
  getAllCandidates,
  getCandidateByLoginId,
};
