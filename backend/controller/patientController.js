const patientModel = require("../model/patient");

const getPatientDetails = async (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required." });
  }

  try {
    const patient = await patientModel.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Optionally, remove sensitive info like password
    const { password, ...patientData } = patient._doc;

    res.status(200).json({ patient: patientData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching patient details." });
  }
};


module.exports = {
    getPatientDetails
}