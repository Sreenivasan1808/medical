const Doctor = require("../model/doctor");

const getDoctorById = async (req, res) => {
  const { doctorId } = req.params;

  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }

  try {
    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({
      doctorId: doctor.doctorId,
      doctorName: doctor.doctorName,
      contactNumber: doctor.contactNumber,
      specialization: doctor.specialization,
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDoctorById };