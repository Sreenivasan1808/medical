const doctorModel = require("../../model/doctor");
const patientModel = require("../../model/patient");

const login = async  (req, res) => {
  const { userType, userId, password } = req.body;
  try {
    if (userType === "doctor") {
        const doctor = await doctorModel.findOne({
          doctorId: userId,
          password: password,
        });
        if (doctor) {
          res
            .status(200)
            .json({ message: "Login Success", userType: "doctor", userId: userId });
        }else{
          res.status(201).json({message: "Invalid Userid or Password"});
        }
      } else if (userType == "patient") {
        const patient = await patientModel.findOne({
          patientId: userId,
          password: password,
        });
        if (patient) {
          res
            .status(200)
            .json({
              message: "Login Success",
              userType: "patient",
              userId: userId,
            });
        }else{
          res.status(201).json({message: "Invalid Userid or Password"});
        }
      } else {
        res.json(200).json({ message: "Login failed, user type invalid" });
      }
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
};

const registerPatient = async (req, res) => {
  // Extract only patient-related fields from the request body
  const {
    patientId,
    patientName,
    age,
    gender,
    contactNumber,
    password,
    address,
  } = req.body.details;
  
  // Basic validation - check required fields are present
  if (!patientId || !patientName || !age || !gender || !contactNumber || !password || !address) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const patient = new patientModel({
      patientId,
      patientName,
      age,
      gender,
      contactNumber,
      password,
      address,
    });
    await patient.save();
    return res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const registerDoctor = async (req, res) => {
  // Extract only doctor-related fields from the request body
  const { doctorId, doctorName, contactNumber, password, specialization } = req.body.details;

  // Basic validation - check required fields are present (specialization can be optional)
  if (!doctorId || !doctorName || !contactNumber || !password) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const doctor = new doctorModel({
      doctorId,
      doctorName,
      contactNumber,
      password,
      specialization, // optional field; if undefined, that is acceptable per schema.
    });
    await doctor.save();
    return res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
    login: login,
    registerPatient: registerPatient,
    registerDoctor: registerDoctor    
}