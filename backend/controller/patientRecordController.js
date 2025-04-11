const doctorModel = require("../model/doctor");
const patientModel = require("../model/patient");
const PatientRecord = require('../model/patientMedicalRecord');

const addPatientRecord = async (req, res) => {
    const {
      doctorId,
      lastVisitDate,
      nextVisitDate,
      currentDiagnosis,
      medication,
      patientId
    } = req.body;
  
    if (!doctorId || !lastVisitDate || !nextVisitDate || !currentDiagnosis || !medication) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const newRecord = new PatientRecord({
        doctorId,
        patientId,
        lastVisitDate,
        nextVisitDate,
        currentDiagnosis,
        medication
      });
  
      await newRecord.save();
      res.status(201).json({ message: 'Patient record added successfully', record: newRecord });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while adding record.' });
    }
  };
  
  const editPatientRecord = async (req, res) => {
    const { id } = req.params; // patient record ID from route
    const updatedData = req.body;
  
    try {
      const updatedRecord = await PatientRecord.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true
      });
  
      if (!updatedRecord) {
        return res.status(404).json({ message: 'Patient record not found.' });
      }
  
      res.status(200).json({ message: 'Patient record updated successfully', record: updatedRecord });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while updating record.' });
    }
  };
  
  const removePatientRecord = async (req, res) => {
    const { id } = req.params; // patient record ID from route
  
    try {
      const deletedRecord = await PatientRecord.findByIdAndDelete(id);
  
      if (!deletedRecord) {
        return res.status(404).json({ message: 'Patient record not found.' });
      }
  
      res.status(200).json({ message: 'Patient record deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while deleting record.' });
    }
  };

  const getPatientRecordsByDoctor = async (req, res) => {
    const { doctorId } = req.params;
  
    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }
  
    try {
      const records = await PatientRecord.find({ doctorId });
  
      if (!records || records.length === 0) {
        return res.status(404).json({ message: "No patient records found for this doctor" });
      }
  
      res.status(200).json(records);
    } catch (error) {
      console.error("Error fetching records by doctor:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const getPatientRecordsByPatient = async (req, res) => {
    const { patientId } = req.params;
  
    try {
      const records = await PatientRecord.find({ patientId });
      
      if (!records || records.length === 0) {
        return res.status(404).json({ message: "No records found for this patient ID." });
      }

      const enrichedRecords = await Promise.all(
        records.map(async (record) => {
          const doctor = await doctorModel.findOne({ doctorId: record.doctorId }).select("doctorName");
          const plainRecord = record.toObject(); // convert Mongoose doc to plain JS object
          plainRecord.doctorName = doctor ? doctor.doctorName : "Unknown Doctor";
          return plainRecord;
        })
      );
      
      // res.status(200).json({ ...records, doctorName });
  
      res.status(200).json(enrichedRecords);
    } catch (error) {
      console.error("Error fetching records by patientId:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  module.exports = {
    addPatientRecord,
    editPatientRecord,
    removePatientRecord,
    getPatientRecordsByDoctor,
    getPatientRecordsByPatient
  }