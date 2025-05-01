const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const PatientRecord = require("../model/patientMedicalRecord");

const predictParkinsonDisease = async (req, res) => {
  try {
    const file = req.file;
    const { patientId } = req.body;

    if (!file) {
      return res.status(400).json({ error: "CSV file is required" });
    }
    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    // Build form-data
    const form = new FormData();
    // If you're using diskStorage:
    form.append("file", fs.createReadStream(file.path), {
      filename: file.originalname,
    });
    // OR, if memoryStorage:
    // form.append("file", file.buffer, { filename: file.originalname });
    form.append("patientId", patientId);

    // Send to Flask
    const apiUrl = "http://localhost:5000/predict/parkinson";
    const predictionResponse = await axios.post(apiUrl, form, {
      headers: form.getHeaders(), // lets form-data set the boundary for you
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const { result } = predictionResponse.data;
    const stringResult =
      result === 1 ? "Parkinson Disease" : "No Parkinson Disease";

    console.log(stringResult);

    // Save into MongoDB
    const updatedRecord = await PatientRecord.findOneAndUpdate(
      { patientId },
      { aiDiagnosis: stringResult },
      { new: true }
    );

    // Clean up temp file if you used diskStorage
    if (file.path) fs.unlinkSync(file.path);

    if (!updatedRecord) {
      return res
        .status(404)
        .json({ error: `No record found for patientId ${patientId}` });
    }

    res.status(200).json({
      message: "Prediction saved to patient record",
      record: updatedRecord,
    });
  } catch (error) {
    console.error("Prediction error:", error);
    // ensure we clean up
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }
    res.status(500).json({ error: "Failed to process prediction" });
  }
};

const predictDiabetes = async (req, res) => {
  try {
    const file = req.file;
    const { patientId } = req.body;

    if (!file) {
      return res.status(400).json({ error: "CSV file is required" });
    }
    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    // Build form-data
    const form = new FormData();
    // If you're using diskStorage:
    form.append("file", fs.createReadStream(file.path), {
      filename: file.originalname,
    });
    // OR, if memoryStorage:
    // form.append("file", file.buffer, { filename: file.originalname });
    form.append("patientId", patientId);

    // Send to Flask
    const apiUrl = "http://localhost:5000/predict/diabetes";
    const predictionResponse = await axios.post(apiUrl, form, {
      headers: form.getHeaders(), // lets form-data set the boundary for you
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const { result } = predictionResponse.data;

    console.log(result);

    // Save into MongoDB
    const updatedRecord = await PatientRecord.findOneAndUpdate(
      { patientId },
      { diabetesDiagnosis: result },
      { new: true }
    );

    // Clean up temp file if you used diskStorage
    if (file.path) fs.unlinkSync(file.path);

    if (!updatedRecord) {
      return res
        .status(404)
        .json({ error: `No record found for patientId ${patientId}` });
    }

    res.status(200).json({
      message: "Prediction saved to patient record",
      record: updatedRecord,
    });
  } catch (error) {
    console.error("Prediction error:", error);
    // ensure we clean up
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }
    res.status(500).json({ error: "Failed to process prediction" });
  }
};

module.exports = {
  predictParkinsonDisease,
  predictDiabetes,
};
